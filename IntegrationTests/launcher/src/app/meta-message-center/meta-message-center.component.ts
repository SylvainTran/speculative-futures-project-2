import { Component, OnInit } from '@angular/core';

class Message {
  constructor(
    public id: number, 
    public sender: string,
    public recipient: string, 
    public title: string,
    public date: string,
    public body: string,

    public replyActionNeeded: boolean) 
  {

  }
}

@Component({
  selector: 'app-meta-message-center',
  templateUrl: './meta-message-center.component.html',
  styleUrls: ['./meta-message-center.component.css']
})
export class MetaMessageCenterComponent implements OnInit {
  rawMessages: Message[] = [];
  outputMessages: Message[] = [];
  bitmapHashMap: Map<number, boolean>;

  constructor() {
    this.bitmapHashMap = new Map<number, boolean>();
    let maxId: number = 7;

    for (let i = 0; i < maxId; i++) {
      this.bitmapHashMap.set(i, false);
    }
  }

  ngOnInit(): void {
    // Test
    this.addNewMessage();
  }

  addNewMessage() {
    this.outputMessages.push(new Message(0, "O-Maron", "Rebecca Cyfer", "About the new job", "2022-06-02 13:37:00", "Hey, congrats on moving out to Titan. We're all proud of you being selected to be part of the new colonist program. Now you'll tell us if you scoop something valuable up there, right? You better, because we're watching your ass. Don't ever stop - Maron", true));
    this.outputMessages.push(new Message(1, "herohero", "Rebecca Cyfe", "About that meeting: Chat Homes 3D - Jazz Lounge", "2022-06-02 13:35:05", "My fellow, to follow thine heart as thunder comes. Join my brethen in the bar lounge in Chat homes? Your spirit beckons to my mail if you are of the green dally. - herohero", true));
    this.outputMessages.push(new Message(2, "SPHINX HR", "Rebecca Cyfer", "SPHINX: Your First Job on Titan", "2022-06-04 15:35:05", "Ms. Cyfer, by pressing the Star icon at the bottom you may open your new work device. Your first task is to review and submit psychological assessment forms on the colonists. The medical team does weekly clinical rounds and certain urgent assessments. You may submit any reasonable number of entries that you wish.", true));
    this.outputMessages.push(new Message(8, "SPHINX HR", "Rebecca Cyfer", "Your Medical Work Device", "2022-06-02 13:35:05", "Ms. Cyfer, welcome to the EXO program! We're excited to get this enterprise started, and every new colonist is incredibly valuable to us. Here we specialize in securing and installing colonists on the most promising planets in the galaxy. We hope you are pleased with your new cabin accomodations. You may now utilize the SPHINX device to connect remotely to the company's Knowledge Center. Good luck - SPHINX", true));
    this.outputMessages.push(new Message(10, "Crew Help", "Rebecca Cyfer", "Number to call for help", "2022-06-03 09:40:05", "Ms. Cyfer, In the asset investigation center, you'll find the number 1-74-10. Enter that number in the fields and submit to receive direct assistance.", true));
  }

  public setBitMapValue(index: number, state: boolean): void {
    this.bitmapHashMap.set(index, state);
  }
}
