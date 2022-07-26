import { Character } from "./character";

export enum FriendshipLevels {
    C = 0, B = 1, A = 2
}

export class Friendship {

    character1: Character;
    character2: Character;
    friendshipLevel: number; // Should be a float or double - want to increase by .5 of a level each time, and force the new interaction to be in a different app

    constructor(requester: Character, target: Character) {
        this.character1 = requester;
        this.character2 = target;
        this.friendshipLevel = FriendshipLevels.C;

        if (!target.friendsMap.has(requester.name)) {
            target.friendsMap.set(requester.name, this);
        }
    }

    increaseFriendshipLevel() {
        this.character1.friendsMap.get(this.character2.name)!.friendshipLevel += 1; // TODO: friendship levels should be the same in the two characters' Friendship object. Is this pass by reference?
    }
}
