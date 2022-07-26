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
    this.outputMessages.push(new Message(0, "Brigadier General Maron", "John - Cyber Investigation Expert", "Your last assignment", "2022-06-02 13:37:00", "John, our last trace of the Queen are in this account. You have access to all the Queen's installed apps and contacts. Please bring her back to us once you've found her whereabouts. Nobody else is capable of this feat except you. Your cyber investigation skills will change the future of the Empire, should you find or fail to find her eminency. Augusta liked to use the handler 'Autumn' in her Verse. Use whatever you can find. - Brigadier General Maron", true));
    this.outputMessages.push(new Message(1, "herohero", "Autumn", "About that meeting: Chat Homes 3D - Jazz Lounge", "2022-07-22 13:35:05", "My fellow, to follow thine heart as thunder comes. Join my brethen in the bar lounge in Chat homes? Your spirit beckons to my mail if you are of the green dally. - herohero", true));
  }
}
