import { Character } from "./character";
import { CharacterDatabaseService, ConversationNode } from "./character-database.service";

export enum FriendshipLevels {
    C = 0, B = 1, A = 2
}

export class Friendship {

    character1: Character;
    character2: Character;
    friendshipLevel: number;
    conversationData: ConversationNode[] = [];                  // TODO: Rename as this is for quest idler only

    constructor(requester: Character, target: Character) {
        this.character1 = requester;
        this.character2 = target;
        this.friendshipLevel = FriendshipLevels.C;

        if (!target.friendsMap.has(requester.name)) {
            target.friendsMap.set(requester.name, this);
        }
    }

    increaseFriendshipLevel() {
        this.character1.friendsMap.get(this.character2.name)!.friendshipLevel++;
    }

    // Sets up the prompts, options, option replies to the friendships db  
    public setupFriendshipsData(characterDatabaseService: CharacterDatabaseService) {
        this.conversationData = characterDatabaseService.conversationNodes.filter(conversation => {
            let eqn = (conversation.characterA === this.character1.name && conversation.characterB.name === this.character2.name) || 
            (conversation.characterA === this.character2.name && conversation.characterB.name === this.character1.name);
            let feq = FriendshipLevels[this.friendshipLevel] === conversation.friendshipLevel;        
            return eqn && feq;
        });
    }
}
