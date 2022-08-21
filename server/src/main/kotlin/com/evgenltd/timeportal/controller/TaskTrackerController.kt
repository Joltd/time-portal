package com.evgenltd.timeportal.controller

import com.evgenltd.timeportal.service.TaskTrackerService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
class TaskTrackerController(
    private val taskTrackerService: TaskTrackerService
) {

    @DeleteMapping("/api/task-tracker")
    fun clearCache(@RequestParam("week") week: LocalDate) = taskTrackerService.clearCache(week)

}
