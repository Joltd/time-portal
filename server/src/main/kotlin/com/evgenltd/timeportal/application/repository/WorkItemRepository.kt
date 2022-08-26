package com.evgenltd.timeportal.application.repository

import com.evgenltd.timeportal.application.entity.WorkItem
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query
import java.time.LocalDate

interface WorkItemRepository : MongoRepository<WorkItem, String> {

    @Query("""
    {
        ${'$'}and: [
          {date: {${'$'}gte: ?0}},
          {date: {${'$'}lt: ?1}}
        ]
    }
    """)
    fun findAllByWeek(from: LocalDate, to: LocalDate): List<WorkItem>

    fun findByDateAndTask(date: LocalDate, task: String): WorkItem?

}
