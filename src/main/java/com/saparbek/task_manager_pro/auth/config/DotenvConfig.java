package com.saparbek.task_manager_pro.auth.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DotenvConfig {

    private final ConfigurableEnvironment environment;

    public DotenvConfig(ConfigurableEnvironment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void loadDotenv() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        Map<String, Object> envMap = new HashMap<>();
        dotenv.entries().forEach(entry -> {
            // ✅ Преобразуем JWT_SECRET → jwt.secret
            String key = entry.getKey().toLowerCase().replace("_", ".");
            envMap.put(key, entry.getValue());
        });

        environment.getPropertySources().addFirst(new MapPropertySource("dotenv", envMap));
    }
}
