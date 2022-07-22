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

  constructor() {}

  ngOnInit(): void {
    // Test
    this.addNewMessage();
  }

  addNewMessage() {
    this.outputMessages.push(new Message(0, "Player", "TryAgain34", "About that meeting: Chat Homes Jazz Lounge", "2022-07-22 13:35:05", "Hey, just to following up on this. Join up in the bar lounge in Chat homes? Let me know if you're interested. - TryAgain34", true));
  }
}
