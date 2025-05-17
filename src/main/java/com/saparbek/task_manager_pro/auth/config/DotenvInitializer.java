package com.saparbek.task_manager_pro.auth.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.MapPropertySource;
import org.springframework.stereotype.Component;

import java.util.*;

//@Component
//public class DotenvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
//
//    @Override
//    public void initialize(ConfigurableApplicationContext context) {
//        Dotenv dotenv = Dotenv.configure().load();
//        Map<String, Object> envMap = new HashMap<>();
//        dotenv.entries().forEach(entry -> envMap.put(entry.getKey(), entry.getValue()));
//        context.getEnvironment().getPropertySources().addFirst(new MapPropertySource("dotenv", envMap));
//    }
//}
