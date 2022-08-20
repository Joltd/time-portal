package com.evgenltd.timeportal.record

import java.time.LocalDate

data class TrackerWorkItem(
    val id: String,
    val task: String,
    val date: LocalDate,
    val duration: Int
)
