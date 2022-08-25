package com.example.questapitest.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

import com.example.questapitest.InvestigationRequestForm;
import com.example.questapitest.KillMonsterQuest;

@RestController
public class WebController {

    @CrossOrigin(origins = "*")
    @GetMapping("/newquest")
    public String getNewQuest(@RequestParam(value = "level", defaultValue = "1") int level, @RequestParam(value = "prereqs", defaultValue = "Tutorial") String[] prereqs, @RequestParam(value = "zone", defaultValue = "1-1") String zone) {
        // TODO validate prereqs, throw error?
        System.out.printf("Providing a new quest!");
        //System.out.printf("level: %d, prereqs: %s, prereqs: %s, zone: %s", level, prereqs[0], prereqs[1], zone);

        KillMonsterQuest killMonsterQuest = new KillMonsterQuest("Kill 2 Monsters in the Forest");
        String.format("Providing new quest for level %d!", level);

        return killMonsterQuest.getData();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/formRequest")
    public String handleFormRequest(@RequestParam(value = "requestType", defaultValue = "data-submit") String requestType, @RequestParam(value = "keywords", defaultValue = "") ArrayList<String> keywords) {
        if (keywords.size() > 0) {
            System.out.printf("Request Type %s, Keyword[0] %s", requestType, keywords.get(0));
        }

        InvestigationRequestForm form = new InvestigationRequestForm(requestType, keywords);
        return form.getData();
    }
}
