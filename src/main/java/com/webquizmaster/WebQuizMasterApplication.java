package com.webquizmaster;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebQuizMasterApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebQuizMasterApplication.class, args);
    }
} 