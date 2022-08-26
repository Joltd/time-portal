package com.evgenltd.timeportal.application.service

import com.evgenltd.timeportal.application.record.TrackerWorkItem
import com.evgenltd.timeportal.common.util.Loggable
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class TaskTrackerService(
    private val taskTrackerAdapter: TaskTrackerAdapter,
    private val cache: CacheManager
) : Loggable() {

    fun clearCache(date: LocalDate) {
        cache.getCache(WORK_ITEM_CACHE)?.evictIfPresent(date.startOfWeek())
    }

    @Cacheable(value = [WORK_ITEM_CACHE], key = "#from")
    fun listWorkItem(from: LocalDate, to: LocalDate): List<TrackerWorkItem> {
        return taskTrackerAdapter.listWorkItem(from, to)
    }

    fun createWorkItem(task: String, date: LocalDate, duration: Int): Boolean = try {
        taskTrackerAdapter.createWorkItem(task, date, duration)
        cache.getCache(WORK_ITEM_CACHE)?.evictIfPresent(date.startOfWeek())
        true
    } catch (e: Exception) {
        log.error("Unable to create work item [$task, $date, $duration]", e)
        false
    }

    private companion object {
        const val WORK_ITEM_CACHE = "work_item"
    }

}
