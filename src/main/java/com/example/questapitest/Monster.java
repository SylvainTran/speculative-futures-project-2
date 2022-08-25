package com.example.questapitest;

//@JsonIgnoreProperties(ignoreUnknown = true)
public class Monster {

    String name;
    String race;
    int hp;
    double expGain;
    int level;
    int stamina;
    String zone;

    public Monster(String name, int level, int hp, int stamina, String race, double expGain) {
        this.name = name;
        this.level = level;
        this.hp = hp;
        this.stamina = stamina;
        this.race = race;
        this.expGain = expGain;
    }

    public Monster() {}

    public String getName() {
        return name;
    }

    public String getRace() {
        return race;
    }

    public int getHp() {
        return hp;
    }

    public double getExpGain() {
        return expGain;
    }

    public int getLevel() {
        return level;
    }

    public int getStamina() { return stamina; }

    public String getZone() {
        return zone;
    }

    @Override
    public String toString() {
        return "{\nname: " + name + ",\nlevel: " + level + ",\nhp: " + hp + ",\nstamina: " + stamina + ",\nrace: " + race + ",\nexpGain: " + expGain + "\n}";
    }

}
