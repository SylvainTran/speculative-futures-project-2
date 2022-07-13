import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-display',
  templateUrl: './chat-display.component.html',
  styleUrls: ['./chat-display.component.css']
})
export class ChatDisplayComponent implements OnInit {
  chatboard: String[] = [];

  constructor() {
    this.chatboard = ["Hello", "How are you?"];
  }

  ngOnInit(): void {

  }

}
