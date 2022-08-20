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
    this.outputMessages.push(new Message(0, "Brigadier General Maron", "John - Cyber Investigation Expert", "Your last assignment", "2022-06-02 13:37:00", "Congratulations on being hired for the job. This may be your most important contract: to find any digital traces or signatures pointing to the Queen's whereabouts or presence in the Net. John, we've just established a live link between your SPHINX and the Queen's last known meta device. You have remote and direct access to all the Queen's last installed apps and contacts. Please complete a C-PIC form with any information that may be useful in the investigation. Queen Augusta liked to use the handler 'Autumn' in her meta verses. Use whatever you can find. When you're ready, use the 'Star' icon in the navigation bar below to open the investigation form. Be aware that any ongoing and future messages from her last contacts will be intercepted and monitored along with any communications from Mission Control. - Brigadier General Maron", true));
    this.outputMessages.push(new Message(1, "herohero", "Autumn", "About that meeting: Chat Homes 3D - Jazz Lounge", "2022-06-02 13:35:05", "My fellow, to follow thine heart as thunder comes. Join my brethen in the bar lounge in Chat homes? Your spirit beckons to my mail if you are of the green dally. - herohero", true));
    this.outputMessages.push(new Message(2, "Brigadier General Maron", "John - Cyber Investigation Expert", "BEWARE OF TROJANS!", "2022-06-03 13:43:00", "I forgot to warn you. Of course, you're the expert here, but some of our databases have been infiltrated before. Especially during critical missions like these. If certain apps appear, make sure to review the white listed apps so that you know what you're getting into. Don't let us down, John. PS: I attached a copy of said white-listed apps. - Brigadier General Maron", true));
    this.outputMessages.push(new Message(3, "Brigadier General Maron", "John - Cyber Investigation Expert", "Support Request for Philosophical and Psychological Reports", "2022-06-03 19:37:00", "John, we've received your support request for expert analysis and interpretation regarding her Grace's... philosophical inquiries. A professional philosopher as well as a clinical psychologist will be dispatched to your support unit soon. - Brigadier General Maron. PS: We're not sure if we can find a theologian or priest alive these days, but we'll get in touch if we do.", true));
    this.outputMessages.push(new Message(4, "Dr. Chillen, PhD, MD", "John - Cyber Investigation Expert", "RE: Support Request for Philosophical and Psychological Reports", "2022-06-04 09:10:00", "Hi Mr. Cyfer, pleased to meet you. I'm Dr. Chillen Strafe, a psychiatrist for the UK special services. I'll be your liaison starting today regarding any concerns or information needed regarding Queen Augusta's mental health. I've attached a preliminary analysis that may prove useful. You may submit a C-PIC request to my address at any time should you need any specific data that could help the investigation. Good luck. - Dr. Chillen", true));
    this.outputMessages.push(new Message(5, "Dr. Chillen, PhD, MD", "John - Cyber Investigation Expert", "Royal Lost Years", "2022-06-05 10:00:00", "Hi Mr. Cyfer, it came to our attention that there is a historical gap of 3 years in the official records. It would be helpful for our analysis if you could track down what could have happened there. Good luck. - Dr. Chillen", true));
    this.outputMessages.push(new Message(6, "Dr. Chillen, PhD, MD", "John - Cyber Investigation Expert", "Education Record", "2022-06-05 11:50:20", "Hi Mr. Cyfer, We forgot to send you her university grades report. Might prove useful somewhere. Good luck. - Dr. Chillen", true));
    this.outputMessages.push(new Message(7, "Dr. Chillen, PhD, MD", "John - Cyber Investigation Expert", "CBT Sessions", "2022-06-12 14:51:04", "Mr. Cyfer, Please find attached a text record of a CBT session (second university year). Good luck. - Dr. Chillen", true));
  }

  public setBitMapValue(index: number, state: boolean): void {
    this.bitmapHashMap.set(index, state);
  }
}
