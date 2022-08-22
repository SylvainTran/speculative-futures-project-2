import { Component, OnDestroy, OnInit } from '@angular/core';
import { ACTORS, MainQuestService, SMSQUEST_GameEventObject, SMS_CLASS } from '../services/main-quest.service';

@Component({
  selector: 'app-sms-window',
  templateUrl: './sms-window.component.html',
  styleUrls: ['./sms-window.component.css']
})
export class SmsWindowComponent implements OnInit, OnDestroy {

  textData: string[] = [];                            // For the Queen
  bossData: string[] = [];                            // For the Boss
  dateData: string[] = [];
  lastEventKey: string = "";
  lastTimeStamp: string = "";
  waitForDelay = false;                               // Flag to register mock delay happening
  breakpointLockActive: boolean = false;              // Used to prevent user pressing send button while mock delay is happening
  currentIndex: number = 0;                           // The current index of the Response text array of the GameEventObject we're actively reading
  preventSpam: boolean = false;
  activeSMSClass: SMS_CLASS | null | undefined;

  constructor(
    private mainQuestService: MainQuestService
  ) 
  {
    this.mainQuestService.TRIGGER_SMS_EVENT$.subscribe({
      next: (data) => this.dispatchSMS(data)
    });
  }
  ngOnDestroy(): void {
    this.mainQuestService.TRIGGER_SMS_EVENT.unsubscribe();
  }

  ngOnInit(): void {
  }

  public dispatchSMS(data: SMS_CLASS) {
    this.activeSMSClass = data;
    if (data.sender === ACTORS.BOSS) {
      this.startAutoSMSProcess(this.bossData, data.eventKey);
    }
    if (data.sender === ACTORS.QUEEN) {
      this.startAutoSMSProcess(this.textData, data.eventKey);
    }
  }

  public async startAutoSMSProcess(outputArray: string[], eventKey: string, currentIndex?: number) {
    const g: SMSQUEST_GameEventObject | undefined = this.mainQuestService.progressionHashMap.get(eventKey) as SMSQUEST_GameEventObject;
    
    this.validateSMSState(g, eventKey);

    this.lastEventKey = eventKey;
    const textToPush: string[] | undefined = g.response;    
    const dateToPush: string | undefined = g.timeStamp;
    
    if (textToPush !== undefined) {

      const mockDelayUnits = Math.floor(Math.random() * 7);
      const mockDelay = mockDelayUnits * 1000;
      
      for(; this.currentIndex < textToPush.length;) {
        const text = textToPush[this.currentIndex];
        // Add fake date delays
        this.addDateDelayText(dateToPush!, mockDelayUnits);

        // Check for @action annotations
        const annotationBegin = text.indexOf('@');
        if (!this.parseAnnotations(text, annotationBegin, currentIndex!, textToPush, outputArray)) {
          return;
        }
        // Simulate delay
        this.simulateDelay(mockDelay);
        await this.until(() => !this.waitForDelay);
      }
    }
  }

  public validateSMSState(g: SMSQUEST_GameEventObject, eventKey: string) {
    let completed: string[] = this.mainQuestService.getSMSEventsCompleted();   
    let satisfiedPreconditions = g.prerequisiteEventKeys.length === 0 || g.prerequisiteEventKeys.every( (key) => completed.includes(key) );

    if (g === undefined) {
      // can't retrieve the data
      return;
    } else if (g.success) {
      // completed condition -> through using @end annotation
      this.addToSMSEventsCompleted(eventKey);
      // this.mainQuestService.saveCompletedSMSEvents();
      return;
    } else if (!satisfiedPreconditions) {
      console.log("Still missing prerequisites for this event to occur!");
      return;
    } else if (this.currentIndex >= g.response.length) {
      return;
    }
  }
  
  public resetSMSState() {
    // completed condition
    this.currentIndex = 0;
    this.lastEventKey = "";
    this.activeSMSClass = null;
  }

  public parseAnnotations(text: string, annotationBegin: number, currentIndex: number, textToPush: string[], outputArray: string[]) {
    if (annotationBegin !== -1) {
      // Possible list of annotations
      const action = text.slice(annotationBegin + 1);
      const textOnly = text.slice(currentIndex, annotationBegin);
      const nextText = textToPush[this.currentIndex + 1];
      const actions = action.split("&");
      actions.forEach(_action => this.processAnnotations(_action, nextText));

      outputArray.push(textOnly);
      if (!actions.includes('end')) {
        this.currentIndex++
      }
      // Wait for player to click on reply button to break out of lock
      return false;
    } else {
      outputArray.push(text);
      this.currentIndex++;
      return true;
    }
  }

  public simulateDelay(mockDelay: number) {
    // Set lock to prevent user from clicking on send at the same time
    this.breakpointLockActive = false;
    // Simulate delay
    this.waitForDelay = true;

    setTimeout( () => {
      this.breakpointLockActive = true;
      this.waitForDelay = false;
    }, mockDelay);
  }
  // TODO: Clean code, polymorphism..
  public processAnnotations(action: string, nextText: string) {
    //@waitReply
    if (action === "waitReply") {
      const inputField = document.getElementById('playerTextInput')! as HTMLInputElement;
      if (nextText) {
        inputField.value = nextText;
      }
    }

    if (action === 'end') {
      this.addToSMSEventsCompleted(this.lastEventKey);
      this.mainQuestService.saveCompletedSMSEvents();
      this.resetSMSState();
      this.clearInputText('playerTextInput');
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

  public continueConversation(inputID: string, outputArray: string[], eventKey: string): void {
    if (!this.breakpointLockActive || this.waitForDelay || this.lastEventKey === "") {
      // Prevents continuing the conversation if we're still in the 
      // middle of a mock delay happening
      console.log("Blocking continue button" + this.waitForDelay + ", " + this.breakpointLockActive + ", " + this.lastEventKey);
     return;
    }
    this.clearInputText(inputID);
    this.startAutoSMSProcess(outputArray, eventKey);
    // Lock for a while
    this.preventSpam = true;
    setTimeout(()=>this.preventSpam = false, 5000);
  }
  
  public clearInputText(id: string) {
    const inputField = document.getElementById(id)! as HTMLInputElement;
    inputField.value = "";
  }

  public addToSMSEventsCompleted(eventKey: string): void {
    let g = this.mainQuestService.progressionHashMap.get(eventKey);
    if (g) {
      g.success = true;
      this.mainQuestService.progressionHashMap.set(eventKey, g);
    }
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
