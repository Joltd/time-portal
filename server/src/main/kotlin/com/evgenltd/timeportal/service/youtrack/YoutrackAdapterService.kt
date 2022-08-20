package com.evgenltd.timeportal.service.youtrack

import com.evgenltd.timeportal.record.TrackerWorkItem
import com.evgenltd.timeportal.service.TaskTrackerAdapter
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset

@Service
class YoutrackAdapterService(
    private val properties: YoutrackProperties,
    private val rest: RestTemplate
) : TaskTrackerAdapter {

    override fun listWorkItem(from: LocalDate, to: LocalDate): List<TrackerWorkItem> {
        val headers = HttpHeaders()
        headers.setBearerAuth(properties.token)

        val uriBuilder = UriComponentsBuilder.fromUriString("${properties.url}/workItems")
            .queryParam("fields", "id,type(id,name),author(id,name),duration(id,minutes),text,date,issue(idReadable)")
            .queryParam("start", from.toTimestamp())
            .queryParam("end", to.toTimestamp())
            .queryParam("author", "me")

        val result = rest.exchange(
            uriBuilder.toUriString(),
            HttpMethod.GET,
            HttpEntity<Unit>(headers),
            YoutrackWorkItemResponse::class.java
        )

        if (result.statusCode != HttpStatus.OK) {
            throw RuntimeException("Youtrack respond with status [${result.statusCode}]")
        }

        return result.body?.map { it.toCommon() } ?: emptyList()
    }

    override fun createWorkItem(task: String, date: LocalDate, duration: Int) {

        val body = YoutrackCreateWorkItemRequest(
            date.toTimestamp(),
            YoutrackCreateWorkItemRequest.Author("1-423"),
            YoutrackCreateWorkItemRequest.Duration(duration),
            YoutrackCreateWorkItemRequest.Type("86-0")
        )

        val headers = HttpHeaders()
        headers.setBearerAuth(properties.token)

        val result = rest.exchange(
            "${properties.url}/issues/${task}/timeTracking/workItems",
            HttpMethod.POST,
            HttpEntity(body, headers),
            Unit::class.java
        )

        if (result.statusCode != HttpStatus.OK) {
            throw RuntimeException("Youtrack respond with status [${result.statusCode}]")
        }

    }

    private fun WorkItem.toCommon() = TrackerWorkItem(
        id,
        issue.idReadable,
        LocalDateTime.ofEpochSecond(date / 1000L, 0, ZoneOffset.UTC).toLocalDate(),
        duration.minutes
    )

    private fun LocalDate.toTimestamp() = atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()

}
