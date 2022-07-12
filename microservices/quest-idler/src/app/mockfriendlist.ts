import { Friend } from './friend';

export class MockFriendList {
    public friendList: Friend[] | undefined = [];

    constructor() {
        let friendNames : string[] = ["Abel", "Cain", "Eden", "Job", "Marcel", "Katherine"];
        friendNames.forEach(name => { this.friendList?.push(new Friend(name, "online"))});
        this.friendList?.map(f => console.log(f.name));
    }
}