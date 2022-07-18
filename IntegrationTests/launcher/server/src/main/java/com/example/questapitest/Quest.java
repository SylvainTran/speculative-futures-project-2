package com.example.questapitest;

public class Quest implements Comparable {
    String name;
    int id;
    double experienceGain;
    int goldGain;
    String[] prerequisites;
    int questLevel;

    public Quest(String name, int id, double experienceGain, int goldGain, String[] prerequisites) {
        this.name = name;
        this.id = id;
        this.experienceGain = experienceGain;
        this.goldGain = goldGain;
        this.prerequisites = prerequisites;
    }

    public Quest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public int getId() {
        return id;
    }

    public double getExperienceGain() {
        return experienceGain;
    }

    public int getGoldGain() {
        return goldGain;
    }

    public String[] getPrerequisites() {
        return prerequisites;
    }

    public int getQuestLevel() {
        return questLevel;
    }

    public void startNewQuest(Player player) {
        player.questsCompletedHashMap.put(name, this);
        player.experience += experienceGain;
        player.gold += goldGain;
        System.out.format("Quest %s Completed!", name);
    }

    public boolean isSameQuestId(int id) {
        return this.id == id;
    }
    public boolean isSameQuestName(String name) {
        return this.name.equals(name);
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Quest)) {
            return false;
        }
        Quest q = (Quest) obj;
        return (isSameQuestId(q.id) && isSameQuestName(q.name));
    }

    @Override
    public int compareTo(Object obj) {
        Quest q = (Quest) obj;
        return q.questLevel - questLevel;
    }

}
