package com.evgenltd.timeportal.controller

import com.evgenltd.timeportal.entity.WorkItem
import com.evgenltd.timeportal.record.SyncResult
import com.evgenltd.timeportal.service.WorkItemService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
class WorkItemController(
    private val workItemService: WorkItemService
) {

    @GetMapping("/api/work-item")
    fun list(@RequestParam("week") week: LocalDate) = workItemService.list(week)

    @GetMapping("/api/work-item/{id}")
    fun byId(@PathVariable id: String) = workItemService.byId(id)

    @PostMapping("/api/work-item")
    fun update(@RequestBody workItem: WorkItem) = workItemService.update(workItem)

    @DeleteMapping("/api/work-item/{id}")
    fun delete(@PathVariable id: String) = workItemService.delete(id)

    @PostMapping("/api/work-item/sync")
    fun sync(@RequestParam("week") week: LocalDate): SyncResult = workItemService.sync(week)

}
