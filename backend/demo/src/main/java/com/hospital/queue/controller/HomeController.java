package com.hospital.queue.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5181")
public class HomeController {

    @GetMapping("/api/home")
    public String home() {
        return "Backend Connected Successfully!";
    }
}