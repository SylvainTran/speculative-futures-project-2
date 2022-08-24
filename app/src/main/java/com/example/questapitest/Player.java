package com.example.questapitest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Player {
    /**
     * Player name.
     */
    String name;
    /**
     * Current level.
     */
    int level;
    /**
     * Quest completed Hash Map.
     */
    Map<String, Quest> questsCompletedHashMap;
    /**
     * Current quest.
     */
    Quest currentQuest;

    /**
     * Experience gained in this current total.
     */
    double experience = 0;
    /**
     * Gold in inventory.
     */
    double gold = 0;

    /**
     * @param name : The player's name.
     * @param level : The player's level.
     * @param questsCompleted : The player's list of completed quests. Put into a hashmap.
     * @param currentQuest : The current quest to undergo.
     */
    public Player(String name, int level, List<Quest> questsCompleted, Quest currentQuest) {
        this.name = name;
        this.level = level;
        this.currentQuest = currentQuest;
        this.questsCompletedHashMap = new HashMap<>();

        // TODO: Player requests any random quest fitting the level? Or provide id in advance?

        // TODO: enhanced for loop
        for (int i = 0; i < questsCompleted.size(); i++) {
            this.addToHashMap(questsCompleted.get(i));
        }
    }

    /**
     * @param q : The quest to add to the hm.
     */
    public void addToHashMap(Quest q) {
        this.questsCompletedHashMap.put(q.name, q);
    }

    /**
     * Starts the quest.
     */
    public void embarkOnQuest() {
        this.currentQuest.startNewQuest(this);
    }
}
