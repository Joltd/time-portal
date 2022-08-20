package com.evgenltd.timeportal.record

import java.time.LocalDate

data class DayWork(val date: LocalDate, val tasks: List<TaskWork>)

data class TaskWork(
    val id: String,
    val name: String,
    val portal: Int,
    val tracker: Int
)
