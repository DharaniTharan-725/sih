package com.agrichain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.agrichain.repository") // Add this line
@EntityScan("com.agrichain.entity") // Add this line
public class AgrichainApplication {
    public static void main(String[] args) {
        SpringApplication.run(AgrichainApplication.class, args);
    }
}