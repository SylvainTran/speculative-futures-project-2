import { Friendship } from "./friendship";

export class Character {
    public name: string = "";
    // Can only request an interaction with the character
    // if this variable is false.
    public isBusy: boolean = false;

    public friendsMap: Map<string, Friendship>;

    constructor(name: string) {
        this.name = name;
        this.friendsMap = new Map<string, Friendship>();
    }
}
