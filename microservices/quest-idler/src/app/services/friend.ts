import { Character } from './character';

export class Friend extends Character {
    public status: string = "";

    constructor(name: string, status: string) {
        super(name);
        this.status = status;
    }
}
