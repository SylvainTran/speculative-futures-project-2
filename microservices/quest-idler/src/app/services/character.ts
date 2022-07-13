import { Friendship } from "./friendship";

export class Character {
    name: string = "";

    friendsMap: Map<String, Friendship>;

    constructor() {
        this.friendsMap = new Map<String, Friendship>();
    }
}
