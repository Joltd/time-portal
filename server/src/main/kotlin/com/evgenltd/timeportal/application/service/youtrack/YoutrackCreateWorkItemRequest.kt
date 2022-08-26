package com.evgenltd.timeportal.application.service.youtrack

class YoutrackCreateWorkItemRequest(
    val date: Long,
    val author: Author,
    val duration: Duration,
    val type: Type
) {

    class Author(val id: String)

    class Duration(val minutes: Int)

    class Issue(var idReadable: String)

    class Type(val id: String)

}
