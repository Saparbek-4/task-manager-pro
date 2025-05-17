package com.saparbek.task_manager_pro;

import com.saparbek.task_manager_pro.auth.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@EnableScheduling
@SpringBootApplication
public class TaskManagerProApplication {

	public static void main(String[] args) {
		new SpringApplicationBuilder(TaskManagerProApplication.class)
				.initializers(new DotenvInitializer())
				.run(args);
	}

}
