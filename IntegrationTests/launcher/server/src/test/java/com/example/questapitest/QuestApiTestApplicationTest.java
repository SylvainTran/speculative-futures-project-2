package com.example.questapitest;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class QuestApiTestApplicationTest {

    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void main() {
    }

    @Test
    void hello() {
    }

    @Test
    void testGetNewQuest() {
        Quest mockQuest = mock(Quest.class);

        ArrayList<Quest> questsCompleted = new ArrayList<>();
        questsCompleted.add(new Quest("Tutorial", 0, 50, 25, null));
        Player player = new Player("Sylvain", 1, questsCompleted, mockQuest);

        player.embarkOnQuest();

        verify(mockQuest, times(1)).startNewQuest(player);
    }

    @Test
    void testGetNewQuestRewards() {
        Quest saveTheDamsel = new Quest("SaveTheDamsel", 1, 100, 150, new String[] {"Tutorial"});

        ArrayList<Quest> questsCompleted = new ArrayList<>();
        questsCompleted.add(new Quest("Tutorial", 0, 50, 25, null));

        Player player = new Player("Sylvain", 1, questsCompleted, saveTheDamsel);

        player.embarkOnQuest();

        assertEquals(saveTheDamsel.experienceGain, player.experience);
        assertEquals(saveTheDamsel.goldGain, player.gold);
    }

    @Test
    void testPlayerMetQuestPrerequisites() {
        Quest saveTheDamsel = new Quest("SaveTheDamsel", 1, 100, 150, new String[] {"Tutorial2"});

        ArrayList<Quest> questsCompleted = new ArrayList<>();
        questsCompleted.add(new Quest("Tutorial", 0, 50, 25, null));
        questsCompleted.add(new Quest("Tutorial2", 0, 50, 25, null));

        Player player = new Player("Sylvain", 1, questsCompleted, saveTheDamsel);

// Alternatively:
//        player.embarkOnQuest();
//        assertNotEquals(saveTheDamsel.experienceGain, player.experience);

        // Multiple or single prereqs:
        for(int i = 0 ; i < saveTheDamsel.prerequisites.length; i++) {
            System.out.format("Quest: %s", saveTheDamsel.prerequisites[i]);
            assertTrue(player.questsCompletedHashMap.containsKey(saveTheDamsel.prerequisites[i]));
        }

        // No prereqs:
        Quest saveTheDamsel2 = new Quest("SaveTheDamsel", 1, 100, 150, new String[] {});

        for(int i = 0 ; i < saveTheDamsel2.prerequisites.length; i++) {
            System.out.format("Quest: %s", saveTheDamsel2.prerequisites[i]);
            assertTrue(player.questsCompletedHashMap.containsKey(saveTheDamsel2.prerequisites[i]));
        }
    }
}
