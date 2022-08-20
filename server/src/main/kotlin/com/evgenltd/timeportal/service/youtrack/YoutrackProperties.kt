package com.evgenltd.timeportal.service.youtrack

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class YoutrackProperties {

    @Value("\${youtrack.url}")
    lateinit var url: String

    @Value("\${youtrack.token}")
    lateinit var token: String

}
