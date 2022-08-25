package com.example.questapitest;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class KillMonsterQuest extends Quest {
    List<Quest> subquestsList;
    List<Monster> monstersList;

    public KillMonsterQuest(String name, int id, double experienceGain, int goldGain, String[] prerequisites, String zone) {
        super(name, id, experienceGain, goldGain, prerequisites, zone);
        monstersList = new ArrayList<Monster>();
        subquestsList = new ArrayList<Quest>();
    }

    public KillMonsterQuest(KillMonsterQuest kmq) {
        super(kmq.name, kmq.id, kmq.experienceGain, kmq.goldGain, kmq.prerequisites, kmq.zone);
        monstersList = kmq.monstersList;
        subquestsList = kmq.subquestsList;
    }

    public KillMonsterQuest(String name) {
        this(name, (int) Math.random() * 1000, 0, 100, new String[]{"None"}, "1-1");
        this.experienceGain = getTotalExpGain();
    }

    public double getTotalExpGain() {
        return monstersList.stream().mapToDouble(x -> x.expGain).sum();
    }

    public int getRandomIntRange(int min, int max) {
        int rand = (int) Math.nextDown(Math.random() * max);

        if (rand == 0) {rand = min;}
        return rand;
    }

    public String getData() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String dataPathPrefix = "data/";
            Path of = Path.of(dataPathPrefix + "MockQuests.json");

            subquestsList = Arrays.asList(mapper.readValue(of.toFile(), Quest[].class));

            Quest[] arr = new Quest[subquestsList.size()]; 
            subquestsList.toArray(arr);
            String questsData = new ObjectMapper().writeValueAsString(arr);
            return questsData;

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public void getRandomQuestData() {
        // ArrayList<Quest> selected = new ArrayList<Quest>();
        // int[] randIndexes = new int[subquestsList.size()];

        // for (int i = 0; i < this.getRandomIntRange(1, randIndexes.length); i++) {
        //     randIndexes[i] = this.getRandomIntRange(0, randIndexes.length);
        //     selected.add(subquestsList.get(randIndexes[i]));
        // }
        // subquestsList = selected;
        // selected.toArray(arr);
    }
}
