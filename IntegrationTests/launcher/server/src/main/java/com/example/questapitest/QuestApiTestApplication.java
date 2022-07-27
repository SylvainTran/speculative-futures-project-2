// This is my package
package com.example.questapitest;

// This is the boot Spring app import
import com.example.questapitest.KillMonsterQuest;
import org.springframework.boot.SpringApplication;
// This is an autoconfigure ..?
import org.springframework.boot.autoconfigure.SpringBootApplication;
// These are the annotations used by Spring
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
// CORS config
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@RestController
public class QuestApiTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuestApiTestApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello, %s from Java Spring Boot!", name);
    }

	@CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("/newquest")
    public String getNewQuest(@RequestParam(value = "level", defaultValue = "1") int level, @RequestParam(value = "prereqs", defaultValue = "Tutorial") String[] prereqs, @RequestParam(value = "zone", defaultValue = "1-1") String zone) {
        // TODO validate prereqs, throw error?
        System.out.printf("Providing a new quest!");

        KillMonsterQuest killMonsterQuest = new KillMonsterQuest("Kill 2 Monsters in the Forest");
        String.format("Providing new quest for level %d!", level);

        return killMonsterQuest.getData();
    }
}
