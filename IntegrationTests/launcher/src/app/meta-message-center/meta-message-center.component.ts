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
    this.outputMessages.push(new Message(1, "herohero", "Autumn", "About that meeting: Chat Homes 3D - Jazz Lounge", "2022-06-02 13:35:05", "My fellow, to follow thine heart as thunder comes. Join my brethen in the bar lounge in Chat homes? Your spirit beckons to my mail if you are of the green dally. - herohero", true));
    // this.outputMessages.push(new Message(2, "SPHINX: Helpful Advice", "Rebecca Cyfer", "BEWARE OF TROJANS!", "2022-06-03 13:43:00", "Dear new resident, Some of our databases have been exposed to a potential security risk. If certain apps appear remotely, make sure to know what you are getting into. - SPHINX", true));
    // this.outputMessages.push(new Message(3, "Adrienne Canbury", "Rebecca Cyfer", "Support Request for Exo-Psychological Reports", "2022-06-03 19:37:00", "Rebecca, Make sure to get acquainted with our ship's medical doctor and philosopher, Dr. Chillen, and Dr. Tony (in the hangar) who is a clinical psychologist. We may be joined by Jen Ryme, our senior engineer later. There will be a meeting with the complete support unit soon. - Adrienne Canbury. PS: We're not sure if we can find a theologian or priest alive these days, but we're working on it. Many of our colonists are worried about their spiritual health.", true));
    // this.outputMessages.push(new Message(4, "Dr. Chillen, PhD, MD", "Rebecca Cyfer", "RE: Support Request for Exo-Psychological Reports", "2022-06-04 09:10:00", "Hello Ms. Rebecca Cyfer, pleased to meet you. I'm Dr. Chillen Strafe. I am the psychiatrist in charge of the EXO unit here. I'll be your liaison starting today regarding any concerns or information needed regarding your residency in the exo program (can I address you less formally maybe? Becca seems like a cool name. I've attached a preliminary analysis of the colonists here that may prove useful. You may submit a Knowledge request to my address at any time should you need any specific data regarding the colony. Good luck with the residency. - Dr. Chillen", true));
    // this.outputMessages.push(new Message(7, "Dr. Chillen, PhD, MD", "Becca", "CBT Sessions", "2022-06-12 14:51:04", "Ms. Cyfer, Please find attached a text record of a CBT session regarding one of the colonists in the current round check. Good luck. - Dr. Chillen", true));
    this.outputMessages.push(new Message(8, "SPHINX: Medical Equipment Device", "Rebecca Cyfer", "Your Work Device", "2022-06-02 13:35:05", "Ms. Cyfer, welcome to the EXO program! We're excited to get this enterprise started, and every new colonist is incredibly valuable to us. Here we specialize in securing and installing colonists on the most promising planets in the galaxy. We hope you are pleased with your new cabin accomodations. You may now utilize the SPHINX device to connect remotely to the company's Knowledge Center. Good luck - SPHINX", true));
    this.outputMessages.push(new Message(10, "Crew Help", "Rebecca Cyfer", "Number to call for help", "2022-06-03 09:40:05", "Ms. Cyfer, In the asset investigation center, you'll find the number 1-74-10. Enter that number in the fields and submit to receive direct assistance.", true));
  }

  public setBitMapValue(index: number, state: boolean): void {
    this.bitmapHashMap.set(index, state);
  }
}
