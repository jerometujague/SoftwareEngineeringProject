package com.commercebank;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc // This tells Spring that we are using a web MVC (Model View Controller)
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map the localhost / domain to the assets folder
        // This routes localhost:8080/ to the assets/ folders
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/assets/")
                .setCachePeriod(31556926);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirect the / domain to index.html
        registry.addRedirectViewController("/", "index.html");
    }
}
