package com.evgenltd.timeportal.service

import com.evgenltd.timeportal.record.DayWork
import com.evgenltd.timeportal.record.TaskWork
import com.evgenltd.timeportal.record.TrackerWorkItem
import com.evgenltd.timeportal.entity.WorkItem
import com.evgenltd.timeportal.record.SyncResult
import com.evgenltd.timeportal.repository.WorkItemRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class WorkItemService(
    private val workItemRepository: WorkItemRepository,
    private val taskTrackerService: TaskTrackerService
) {

    fun sync(week: LocalDate): SyncResult {

        val from = week.startOfWeek()
        val to = week.endOfWeek()

        val trackerWorkItems = taskTrackerService.listWorkItem(from, to)
            .associateBy { it.date to it.task }

        val portalWorkItems = workItemRepository.findAllByWeek(from, to)
        var done = 0
        var skipped = 0

        for (workItem in portalWorkItems) {

            val task = workItem.task!!
            val date = workItem.date!!
            val portalDuration = workItem.duration ?: 0
            val trackerDuration = trackerWorkItems[date to task]?.duration ?: 0

            val needToReport = portalDuration - trackerDuration
            if (needToReport <= 0) {
                skipped++
                continue
            }

            val result = taskTrackerService.createWorkItem(task, date, needToReport)
            if (result) {
                done++
            } else {
                skipped++
            }

        }

        return SyncResult(done, skipped)

    }

    fun list(date: LocalDate): List<DayWork> {
        val from = date.startOfWeek()
        val to = date.endOfWeek()
        val portalWorkItems = workItemRepository.findAllByWeek(from, to)
            .map { it.toInternal() }
        val trackerWorkItems = taskTrackerService.listWorkItem(from, to)
            .map { it.toInternal() }

        return (portalWorkItems + trackerWorkItems)
            .groupBy { it.date }
            .map { it.toDayWork() }
    }

    fun byId(id: String): WorkItem = workItemRepository.findByIdOrNull(id)
        ?: throw IllegalArgumentException("WorkItem [$id] not found")

    fun update(forSave: WorkItem) {
        val date = forSave.date ?: throw IllegalArgumentException("Date is not specified")
        val task = forSave.task ?: throw IllegalArgumentException("Task is not specified")
        val duration = forSave.duration ?: 0
        if (duration == 0) {
            throw IllegalArgumentException("Duration should be non empty")
        }

        val existed = workItemRepository.findByDateAndTask(date, task)
        if (existed == null) {
            workItemRepository.save(forSave)
        } else if (forSave.id == null) {
            existed.duration = duration
            workItemRepository.save(existed)
        } else {
            forSave.duration = (forSave.duration ?: 0) + (existed.duration ?: 0)
            workItemRepository.save(forSave)
            workItemRepository.delete(existed)
        }
    }

    fun delete(id: String) = workItemRepository.deleteById(id)

    private fun TrackerWorkItem.toInternal() = InternalWorkItem(null, date, task, 0, duration)

    private fun WorkItem.toInternal() = InternalWorkItem(id, date!!, task!!, duration!!, 0)

    private fun Map.Entry<LocalDate, List<InternalWorkItem>>.toDayWork() =
        DayWork(key, value.groupBy { it.task }.map { it.trackerToTaskWork() })

    private fun Map.Entry<String, List<InternalWorkItem>>.trackerToTaskWork() = value.reduce { acc, next ->
        InternalWorkItem(acc.id ?: next.id, acc.date, acc.task, acc.portal + next.portal, acc.tracker + next.tracker)
    }.let { TaskWork(it.id ?: "", it.task, it.portal, it.tracker) }

}

fun LocalDate.startOfWeek(): LocalDate = minusDays(dayOfWeek.value - 1L)

fun LocalDate.endOfWeek(): LocalDate = startOfWeek().plusWeeks(1).minusDays(1)

private data class InternalWorkItem(
    val id: String?,
    val date: LocalDate,
    val task: String,
    val portal: Int,
    val tracker: Int
)
