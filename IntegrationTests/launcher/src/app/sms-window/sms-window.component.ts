import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameEventObject, MainQuestService } from '../services/main-quest.service';

@Component({
  selector: 'app-sms-window',
  templateUrl: './sms-window.component.html',
  styleUrls: ['./sms-window.component.css']
})
export class SmsWindowComponent implements OnInit, OnDestroy {

  textData: string[] = [];
  dateData: string[] = [];
  lastEventKey: string = "";
  lastTimeStamp: string = "";
  waitForDelay = false;                               // Flag to register mock delay happening
  breakpointLockActive: boolean = false;              // Used to prevent user pressing send button while mock delay is happening
  currentIndex: number = 0;                           // The current index of the Response text array of the GameEventObject we're actively reading

  constructor(private mainQuestService: MainQuestService) 
  {
    this.mainQuestService.questEventSuccessSource$.subscribe({
      next: (eventKey) => this.startAutoSMSProcess(eventKey, 0)
    })
  }
  ngOnDestroy(): void {
    this.mainQuestService.questEventSuccessSource.unsubscribe();
  }

  ngOnInit(): void {
  }

  public async startAutoSMSProcess(eventKey: string, currentIndex?: number) {
    const g: GameEventObject | undefined = this.mainQuestService.progressionHashMap.get(eventKey);
    if (g === undefined) {
      // can't retrieve the data
      return;
    } else if (g?.Success && currentIndex! >= g.Response.length) {
      // completed condition
      this.currentIndex = 0;
      this.lastEventKey = "";
      return;
    }

    this.lastEventKey = eventKey;

    const textToPush: string[] | undefined = g?.Response;    
    let dateToPush: string | undefined = g?.TimeStamp;
    
    if (textToPush !== undefined) {

      const mockDelayUnits = Math.floor(Math.random() * 3);
      const mockDelay = mockDelayUnits * 1000;
      
      for(; this.currentIndex < textToPush.length;) {
        const text = textToPush[this.currentIndex];
        this.addDateDelayText(dateToPush!, mockDelayUnits);

        // Check for @action annotations
        const annotationBegin = text.indexOf('@');

        if (annotationBegin !== -1) {
          const action = text.slice(annotationBegin + 1);
          const textOnly = text.slice(currentIndex, annotationBegin);
          const nextText = textToPush[this.currentIndex + 1];

          if (action === "waitReply") {
            const inputField = document.getElementById('playerTextInput')! as HTMLInputElement;
            if (nextText) {
              inputField.value = nextText;
            }
          }
          this.textData.push(textOnly);
          this.currentIndex++
          // Wait for player to click on reply button to break out of lock
          return;
        } else {
          this.textData.push(text);
          this.currentIndex++
        }

        // Set lock to prevent user from clicking on send at the same time
        this.breakpointLockActive = false;

        // Simulate delay
        this.waitForDelay = true;

        setTimeout( () => {
          this.breakpointLockActive = true;
          this.waitForDelay = false;
        }, mockDelay);
        await this.until(() => !this.waitForDelay);

        // Prevent spamming same conversation
        g.Success = true;
      }
    }
  }

  // Used for async/await mock delays
  public until(conditionFunction: Function) {
    const poll = (resolve: any) => {
      if(conditionFunction()) resolve();
      else setTimeout((_:any) => poll(resolve), 400);
    }
    return new Promise(poll);
  }

  public continueConversation(): void {
    if (!this.breakpointLockActive) {
      // Prevents continuing the conversation if we're still in the 
      // middle of a mock delay happening
      return;
    }
    const inputField = document.getElementById('playerTextInput')! as HTMLInputElement;
    inputField.value = "";
    this.startAutoSMSProcess(this.lastEventKey);
  }

  // Adds delay text depending on the mock delay units used earlier
  public addDateDelayText(dateToPush: string, mockDelayUnits: number) {
    if (dateToPush !== undefined) {
      const timeToUse = this.lastTimeStamp === "" ? dateToPush : this.lastTimeStamp;
      // seconds at charIndex 23-24
      const seconds = [parseInt(timeToUse.charAt(22)), parseInt(timeToUse.charAt(23))];
      const oldSeconds = seconds.slice();
      const newValue = seconds[1] + mockDelayUnits;

      if (newValue > 9) {
        seconds[0] = (seconds[0] + 1) % 5;
        seconds[1] = (newValue - oldSeconds[1] - 1);
      } else {
        seconds[1] = newValue;
      }
      const newSeconds = seconds[0] + "" + seconds[1];

      let newTimeStamp = timeToUse.substring(0, 22) + newSeconds + timeToUse.substring(24);
      // Update dateToPush to last value
      let delta = 60 - parseInt(oldSeconds[0] + "" + oldSeconds[1]);
      if (parseInt(seconds[0] + "" + seconds[1]) - parseInt(oldSeconds[0] + "" + oldSeconds[1]) >= delta) {
        // at 20 is the minutes
        newTimeStamp = newTimeStamp.substring(0, 20) + (parseInt(newTimeStamp.substring(20, 21)) + 1) + newTimeStamp.substring(21);
      }
      dateToPush = newTimeStamp; // TODO: update hours too following this...
      this.dateData.push(newTimeStamp);
      this.lastTimeStamp = newTimeStamp;
    }
  }
}
