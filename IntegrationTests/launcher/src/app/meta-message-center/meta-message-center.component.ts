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
    this.outputMessages.push(new Message(0, "Player", "TryAgain34", "About that meeting: Chat Homes 3D - Jazz Lounge", "2022-07-22 13:35:05", "My fellow, to follow thine heart as thunder comes. Join my brethen in the bar lounge in Chat homes? Your spirit beckons to my mail if you are of the green dally. - TryAgain34", true));
  }
}
