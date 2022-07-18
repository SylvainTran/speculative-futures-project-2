import { Character } from "./character";

export class Friendship {

    character1: Character;
    character2: Character;

    friendshipLevel: string = "C";

    constructor(character1: Character, character2: Character) {
        this.character1 = character1;
        this.character2 = character2;
        character1.friendsMap.set(character2.name, this);
        character2.friendsMap.set(character1.name, this);        
    }
}
