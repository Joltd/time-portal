package com.evgenltd.timeportal.service

import com.evgenltd.timeportal.record.TrackerWorkItem
import java.time.LocalDate

interface TaskTrackerAdapter {

    fun listWorkItem(from: LocalDate, to: LocalDate): List<TrackerWorkItem>

    fun createWorkItem(task: String, date: LocalDate, duration: Int)

}
