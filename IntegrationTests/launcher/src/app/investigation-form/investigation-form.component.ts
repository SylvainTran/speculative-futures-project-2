import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainQuestService } from '../services/main-quest.service';

@Component({
  selector: 'app-investigation-form',
  templateUrl: './investigation-form.component.html',
  styleUrls: ['./investigation-form.component.css']
})
export class InvestigationFormComponent implements OnInit {

  formModel: FormGroup;
  requestType?: string;
  successResponse: string = "";
  lastSuccessResponseKey: string = "";
  private url: string = environment.url;
  private port: string = environment.port;

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private mainQuestService: MainQuestService
  ) 
  {
    this.formModel = this.fb.group({
      requestType: this.fb.group({
        typeA: [null],
        typeB: [null]
      }),
      keywords: this.fb.array([])
    });
  }

  public ngOnInit(): void {
  }
  
  public createKeywordField(): FormGroup {
    return this.fb.group({
      keywordName: ""
    })
  }

  public get keywords(): FormArray {
    return <FormArray> this.formModel.get('keywords');
  }

  public addKeyword() {
    this.keywords.push(this.createKeywordField());
  }

  public removeKeyword(index: number) {
    this.keywords.removeAt(index);
  }

  public onSubmit() {
    console.log(this.formModel.value);    
    this.submitForm("/formRequest")?.subscribe({
      next: (data: any) => {
        if (data.response !== null && data.response !== "") {
          console.log("Form request data received from Mission Control: " + data.response);

          this.successResponse = data.response;
          this.lastSuccessResponseKey = data.eventKey;

          // Distinguish between form event keys
          if (data.eventKey === 'neptunia') {
            this.mainQuestService.TRIGGER_SMS_EVENT.next(this.lastSuccessResponseKey);
          } 

        } else {
          this.successResponse = "";
        }
      },
      error: (err: Error) => console.error('Observer got an error: ' + err.message),
      complete: () => console.log('Observer got a complete notification')      
    });
  }

  public submitForm(routeName: string) {
    if (this.formModel.status !== 'VALID') {
      console.error("Invalid form state.");
      return;
    }
    const path: string = this.url + this.port + routeName;

    let keywordStrArray: string[] = [];
    console.log("OBJECT: " + JSON.stringify(this.keywords.value));

    for(let i = 0; i < this.keywords.length; i++) {
      let val = this.keywords.value[i];

      console.log("VAL: " + Object.values(val));
      let str = Object.values(val)[0] as string;
      if (str) {
        keywordStrArray.push(str.trim().toLowerCase());
      }
    }
    console.log("keywordstrarray " + keywordStrArray);
    
    let params = new HttpParams();
    if (this.requestType) {
      params = params.append('requestType', this.requestType!);
    }
    if (keywordStrArray) {
      keywordStrArray.forEach(keyword => {
        params = params.append('keywords', keyword)
        console.log(keyword);
      });
    }
    return this.http.get<any>(path, {params: params});
  }

  public changeRequestType(event: any) {
    console.log(event.target.value);
    this.requestType = event.target.value;
    // Update form fields if its data request vs submission

    if (this.requestType === "data-request") {
      // Dynamically add new fields?

    }
  }

  public changeKeywordField(event: any) {

  }
}
