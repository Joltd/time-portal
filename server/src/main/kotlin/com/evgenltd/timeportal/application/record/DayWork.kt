package com.evgenltd.timeportal.application.record

import java.time.LocalDate

data class DayWork(
    val date: LocalDate,
    val portal: Int,
    val tracker: Int,
    val tasks: List<TaskWork>
)

data class TaskWork(
    val id: String,
    val name: String,
    val portal: Int,
    val tracker: Int
)
