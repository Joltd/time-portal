package com.evgenltd.timeportal

import com.evgenltd.timeportal.common.util.RestLoggingInterceptor
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.http.client.BufferingClientHttpRequestFactory
import org.springframework.http.client.SimpleClientHttpRequestFactory
import org.springframework.web.client.RestTemplate
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@SpringBootApplication
@EnableCaching
class Application : SpringBootServletInitializer() {

    @Bean
    fun webMvcConfigurer(): WebMvcConfigurer = object : WebMvcConfigurer {
        override fun addCorsMappings(registry: CorsRegistry) {
            registry.addMapping("/**")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedOrigins("http://localhost")
        }
    }

    @Bean
    fun restTemplate(interceptor: RestLoggingInterceptor) = RestTemplate(BufferingClientHttpRequestFactory(SimpleClientHttpRequestFactory()))
        .also { it.interceptors = it.interceptors + listOf(interceptor) }

}

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
