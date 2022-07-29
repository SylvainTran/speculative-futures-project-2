import { Friendship } from "./friendship";
import { Character } from "./character";
import { Player } from "./player";
import { CharacterDatabaseService } from "./character-database.service";

export class CharacterManager {

    characterDatabaseService: CharacterDatabaseService;

    characters: Character[] = [];

    friendships: Friendship[] = [];

    constructor(characterDatabaseService: CharacterDatabaseService) {
        this.characterDatabaseService = characterDatabaseService;
        // Init the player
        // this.createNewFriendship(player, );
    }

    public getCharactersFromDatabase() {

    }

    public createNewFriendship(character1: Character, character2: Character) {
        this.addFriendship(new Friendship(character1, character2));
    }

    public addFriendship(newFriendship: Friendship) {
        this.friendships.push(newFriendship);
    }

}
