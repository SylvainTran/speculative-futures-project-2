import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ACTORS, MainQuestService, SMSQUEST_GameEventObject, SMS_CLASS } from '../services/main-quest.service';

@Component({
  selector: 'app-sms-window',
  templateUrl: './sms-window.component.html',
  styleUrls: ['./sms-window.component.css']
})
export class SmsWindowComponent implements OnInit, OnDestroy {

  dateData: string[] = [];
  lastEventKey: string = "";
  lastTimeStamp: string = "";
  waitForDelay = false;                               // Flag to register mock delay happening
  preventSpam: boolean = false;
  activeSMSWindows: SMS_CLASS[] = [];                 // Tracked by ngFor in the template: sms windows currently active for texting
  deleteIndex: number = -1;                           // Used to delete windows

  constructor(
    private mainQuestService: MainQuestService,
    private cdr: ChangeDetectorRef
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
    // Create the window then when its done, pop up the SMS
    this.SMSWindowBuilder(data);
    this.cdr.detectChanges();
    this.startAutoSMSProcess(data);
  }

  // Custom tracker for ngFor displaying sms windows
  // uses the unique input id specified for change detection
  public byInputID(index: number, data: SMS_CLASS) {
    return data.inputID;
  }

  // startAutoSMSProcess(data: SMS_CLASS) 
  //
  // This is async and probably does too many things currently
  // Generates SMS windows and uses a custom annotation processor to apply certain actions mid dialogue
  public async startAutoSMSProcess(data: SMS_CLASS) {

    const g: SMSQUEST_GameEventObject | undefined = this.mainQuestService.progressionHashMap.get(data.eventKey) as SMSQUEST_GameEventObject;
    
    this.validateSMSState(g, data);

    this.lastEventKey = data.eventKey;
    // Setup the windows to be generated
    data.setTextData(g.response);
    data.setInputID(g.inputID);

    const dateToPush: string | undefined = g.timeStamp;
    
    if (data.textData !== undefined) {

      const mockDelayUnits = Math.floor(Math.random() * 7);
      const mockDelay = mockDelayUnits * 1000;
      
      for(; data.currentIndex < data.textData.length;) {
        let text = data.textData[data.currentIndex];

        // Add fake date delays
        this.addDateDelayText(dateToPush!, mockDelayUnits);

        // Add color styling based on talker
        if (text.indexOf(ACTORS[ACTORS.Cyfer]) > -1) {
          data.colorByTextOnlyIndexTalker.push(ACTORS[ACTORS.Cyfer]);
        } else {
          data.colorByTextOnlyIndexTalker.push(data.sender);
        }

        // Remove name tags from line
        // const nameTagDelimiterIndex = text.indexOf(':');
        // data.textData[data.currentIndex] = data.textData[data.currentIndex].slice(nameTagDelimiterIndex + 1);
        
        // Check for @action annotations
        const annotationBegin = text.indexOf('@');
        const annotationResult = this.parseAnnotations(data, annotationBegin);

        data.addTextOnly(annotationResult.data);

        if (!annotationResult.result) {
          return;
        }
        // Simulate delay
        this.simulateDelay(mockDelay);
        await this.until(() => !this.waitForDelay);
      }
    }
  }
  
  public validateSMSState(g: SMSQUEST_GameEventObject, data: SMS_CLASS) {
    let completed: string[] = this.mainQuestService.getSMSEventsCompleted();   
    let satisfiedPreconditions = g.prerequisiteEventKeys.length === 0 || g.prerequisiteEventKeys.every( (key) => completed.includes(key) );

    if (g === undefined) {
      // can't retrieve the data
      return;
    } else if (g.success) {
      // completed condition -> through using @end annotation
      this.addToSMSEventsCompleted(data.eventKey);
      // TODO: decide if save load events or not: this.mainQuestService.saveCompletedSMSEvents();
      return;
    } else if (!satisfiedPreconditions) {
      console.log("Still missing prerequisites for this event to occur!");
      return;
    } else if (data.currentIndex >= g.response.length) {
      return;
    }
  }

  public parseAnnotations(data: SMS_CLASS, annotationBegin: number) {
    let hadNoAnnotations = false;
    let dataToAdd = "";

    if (annotationBegin > -1) {
      
      // Possible list of annotations
      const action = data.textData[data.currentIndex].slice(annotationBegin + 1);
      const textOnly = data.textData[data.currentIndex].slice(0, annotationBegin);
      const nextText = data.textData[data.currentIndex + 1];
      const actions = action.split("&");
      try {
        actions.forEach(_action => this.processAnnotations(data, _action, nextText));
      } catch(exception: any) {
        // FIXME: currently this always occurs on the first SMS message?!
        console.error(exception.message);
      } finally {
        dataToAdd = textOnly;
        data.currentIndex++
      }
    } else {
      hadNoAnnotations = true;
      dataToAdd = data.textData[data.currentIndex];
      data.currentIndex++;      
    }
    return { result: hadNoAnnotations, data: dataToAdd};
  }

  public SMSWindowBuilder(data: SMS_CLASS) {
    if (this.SMSWindowFromSenderExists(data)) {
      if (this.findSMSWindowFromSender(data)) {
        this.deleteSMSWindowFromSender(this.deleteIndex);
      }
    }
    // Force re-render the ngFor loop by using an assignment bind
    this.reAssignSMSWindows(data);
  }

  public reAssignSMSWindows(data: SMS_CLASS) {
    this.activeSMSWindows = [...this.activeSMSWindows, data];
  }

  public SMSWindowFromSenderExists(data: SMS_CLASS) {
    return this.activeSMSWindows.some((window) => window.sender === data.sender);
  }

  public findSMSWindowFromSender(data: SMS_CLASS) {
    let exists = this.activeSMSWindows.map((window, index) => {
      if (window.sender === data.sender) {
        this.deleteIndex = index;
        return true;
      } 
      return false;
    });
    return exists.length > 0;
  }

  public deleteSMSWindowFromSender(deleteIndex: number) {
    if (deleteIndex > -1) {
      this.activeSMSWindows.splice(deleteIndex, 1);
      deleteIndex = -1;
    }
  }

  public simulateDelay(mockDelay: number) {
    // Set lock to prevent user from clicking on send at the same time
    // Simulate delay
    this.waitForDelay = true;

    setTimeout( () => {
      this.waitForDelay = false;
    }, mockDelay);
  }
  // TODO: Clean code, polymorphism..
  public processAnnotations(data: SMS_CLASS, action: string, nextText: string) {
    //@waitReply
    if (action === "waitReply") {
      const inputField = document.getElementById(data.inputID)! as HTMLInputElement;
      if (inputField === null) {
        console.error("Null input field: id=" + data.inputID);
      }
      if (inputField && nextText) {
        inputField.value = nextText;
      }
    }

    if (action === 'end') {
      this.addToSMSEventsCompleted(data.eventKey);
      //this.mainQuestService.saveCompletedSMSEvents();
      this.clearInputText(data.inputID);
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

  public continueConversation(data: SMS_CLASS): void {
    if (this.waitForDelay || this.lastEventKey === "") {
      // Prevents continuing the conversation if we're still in the 
      // middle of a mock delay happening
      console.log("Blocking continue button" + this.waitForDelay + ", " + this.lastEventKey);
     return;
    }
    this.clearInputText(data.inputID);
    this.startAutoSMSProcess(data);
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
