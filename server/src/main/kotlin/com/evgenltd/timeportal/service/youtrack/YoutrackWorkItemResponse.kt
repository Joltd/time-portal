package com.evgenltd.timeportal.service.youtrack

class YoutrackWorkItemResponse : ArrayList<WorkItem>()

class WorkItem(
    val id: String,
    val date: Long,
    val issue: Issue,
    val type: Type,
    val author: Author,
    val duration: Duration
) {

    class Author(
        val id: String,
        val name: String
    )

    class Duration(val minutes: Int)

    class Issue(var idReadable: String)

    class Type(
        val id: String,
        val name: String
    )

}
