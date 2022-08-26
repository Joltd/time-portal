package com.evgenltd.timeportal.application.entity

import org.springframework.data.annotation.Id
import java.time.LocalDate

class WorkItem(
    @Id
    var id: String? = null,
    var task: String? = null,
    var date: LocalDate? = null,
    var duration: Int? = null
)
