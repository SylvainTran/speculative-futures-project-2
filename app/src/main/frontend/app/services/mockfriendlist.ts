import { Friend } from './friend';

export class MockFriendList {
    public friendList: Friend[] | undefined = [];

    constructor() {
        //let friendNames : string[] = ["TryAgain34", "_purgeMe_", "SylvainTran", "herohero", "Eden_Martrop", "Aingealag", "fallingheadfirst49", "BoboCannon", "Catherine", "D_Jeanne58"];
        let friendNames : string[] = ["TryAgain34", "SylvainTran", "herohero"];
        friendNames.forEach(name => { this.friendList?.push(new Friend(name, "online"))});
        this.friendList?.map(f => console.log(f.name));
    }
}