import { Friend } from './friend';

export class MockFriendList {
    public friendList: Friend[] | undefined = [];

    constructor() {
        let friendNames : string[] = ["Abel34", "Cain_Regelia", "Eden_Martrop", "Job_Job", "Marcellson", "Katherine", "Jeanne58"];
        friendNames.forEach(name => { this.friendList?.push(new Friend(name, "online"))});
        this.friendList?.map(f => console.log(f.name));
    }
}