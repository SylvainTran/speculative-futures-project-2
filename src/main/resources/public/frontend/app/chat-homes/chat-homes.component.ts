import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Character } from '../services/character';
// import { sendMessageToUnity } from '../../js/myscript.mjs';

@Component({
  selector: 'app-chat-homes',
  templateUrl: './chat-homes.component.html',
  styleUrls: ['./chat-homes.component.css']
})
export class ChatHomesComponent implements OnInit, AfterViewInit {

  // The list of characters that would need to be spawned in the unity instance
  charactersOnline: Character[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  public sendMessageToUnity() {
    //sendMessageToUnity();
  }
}