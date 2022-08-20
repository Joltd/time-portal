package com.evgenltd.timeportal.service

import com.evgenltd.timeportal.record.TrackerWorkItem
import com.evgenltd.timeportal.service.util.Loggable
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class TaskTrackerService(
    private val taskTrackerAdapter: TaskTrackerAdapter,
    private val cache: CacheManager
) : Loggable() {

    @Cacheable(value = ["work-items"], key = "#from")
    fun listWorkItem(from: LocalDate, to: LocalDate): List<TrackerWorkItem> {
        return taskTrackerAdapter.listWorkItem(from, to)
    }

    fun createWorkItem(task: String, date: LocalDate, duration: Int): Boolean = try {
        taskTrackerAdapter.createWorkItem(task, date, duration)
        cache.getCache("work-items")?.evictIfPresent(date.startOfWeek())
        true
    } catch (e: Exception) {
        log.error("Unable to create work item [$task, $date, $duration]", e)
        false
    }

}
