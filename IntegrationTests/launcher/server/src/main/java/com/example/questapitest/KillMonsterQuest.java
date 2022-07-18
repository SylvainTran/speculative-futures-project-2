package com.example.questapitest;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class KillMonsterQuest extends Quest {
    List<Monster> monstersList;

    public KillMonsterQuest(String name, int id, double experienceGain, int goldGain, String[] prerequisites) {
        super(name, id, experienceGain, goldGain, prerequisites);
        monstersList = new ArrayList<Monster>();
    }

    public KillMonsterQuest(KillMonsterQuest kmq) {
        super(kmq.name, kmq.id, kmq.experienceGain, kmq.goldGain, kmq.prerequisites);
        monstersList = kmq.monstersList;
    }

    public KillMonsterQuest(String name) {
        this(name, (int) Math.random() * 1000, 0, 100, new String[]{"None"});
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
            Path currentRelativePath = Paths.get("");
            String pathPrefix = currentRelativePath.toAbsolutePath().toString();
            // Debugger starts from a different path than gradle bootRun
            String projectPrefix = "/IntegrationTests/launcher/server";
            Path of = Path.of(pathPrefix + projectPrefix + "/data/MockMonsters.json");

            monstersList = Arrays.asList(mapper.readValue(of.toFile(), Monster[].class));
            ArrayList<Monster> selected = new ArrayList<Monster>();
            int[] randIndexes = new int[monstersList.size()];

            for (int i = 0; i < this.getRandomIntRange(1, randIndexes.length); i++) {
                randIndexes[i] = this.getRandomIntRange(0, randIndexes.length);
                selected.add(monstersList.get(randIndexes[i]));
            }
            monstersList = selected;
            String monstersData = new ObjectMapper().writeValueAsString(selected);

            // TODO: this doesn't work yet
            //KillMonsterQuest serializedQuest = new KillMonsterQuest(this);
            //String jsonStr = mapper.writeValueAsString(serializedQuest);

            return monstersData;

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
