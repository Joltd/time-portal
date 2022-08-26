package com.evgenltd.timeportal.application.controller

import com.evgenltd.timeportal.application.service.TaskTrackerService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
class TaskTrackerController(
    private val taskTrackerService: TaskTrackerService
) {

    @DeleteMapping("task-tracker")
    fun clearCache(@RequestParam("week") week: LocalDate) = taskTrackerService.clearCache(week)

}
