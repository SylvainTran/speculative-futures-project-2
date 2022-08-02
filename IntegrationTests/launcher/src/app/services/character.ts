import { Friendship } from "./friendship";

const m_physicalActions: string[] = ["pulverize", "push", "hammer", "cut", "pummel", "break", "throw", "blow"];
const m_nonPhysicalActions: string[] = ["reflect", "prepare", "anticipate", ""];
const monsters = []; // pull from dariusk corpora

export class Character {
    public name: string = "";
    // Can only request an interaction with the character
    // if this variable is false.
    public isBusy: boolean = false;

    public friendsMap: Map<string, Friendship>;

    public actionsClickedMap: Map<string, number>; // count for party quest

    constructor(name: string) {
        this.name = name;
        this.friendsMap = new Map<string, Friendship>();
        this.actionsClickedMap = new Map<string, number>();
        //this.actionsClickedMap.set()
    }
}
