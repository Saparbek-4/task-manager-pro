package com.saparbek.task_manager_pro.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Enable SockJS and allow connections from HTTPS origins (including Render)
        registry
                .addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Or restrict to your frontend domain
                .withSockJS()
                .setSessionCookieNeeded(false); // Disable JSESSIONID cookie (often required on Render)
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); // Messages to subscribers
        registry.setApplicationDestinationPrefixes("/app"); // Messages from client
    }
}
