import { Character } from "./character";

export enum FriendshipLevels {
    C = 0, B = 1, A = 2
}

export class Friendship {

    character1: Character;
    character2: Character;
    friendshipLevel: number;

    constructor(requester: Character, target: Character) {
        this.character1 = requester;
        this.character2 = target;
        this.friendshipLevel = FriendshipLevels.C;

        if (!target.friendsMap.has(requester.name)) {
            target.friendsMap.set(requester.name, this);
        }
    }

    increaseFriendshipLevel() {
        this.character1.friendsMap.get(this.character2.name)!.friendshipLevel++; // TODO: friendship levels should be the same in the two characters' Friendship object. Is this pass by reference?
    }
}
