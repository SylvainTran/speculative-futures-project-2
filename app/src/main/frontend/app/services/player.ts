import { CharacterDatabaseService } from "./character-database.service";
import { Character } from "./character";

export class Player extends Character {

    constructor(name: string) {
        super(name);
    }
}
