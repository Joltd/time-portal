package com.evgenltd.timeportal.application.service

import com.evgenltd.timeportal.application.record.TrackerWorkItem
import java.time.LocalDate

interface TaskTrackerAdapter {

    fun listWorkItem(from: LocalDate, to: LocalDate): List<TrackerWorkItem>

    fun createWorkItem(task: String, date: LocalDate, duration: Int)

}
