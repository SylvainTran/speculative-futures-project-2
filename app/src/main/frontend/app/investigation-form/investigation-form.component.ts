import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ACTORS, MainQuestService, SMS_CLASS } from '../services/main-quest.service';

@Component({
  selector: 'app-investigation-form',
  templateUrl: './investigation-form.component.html',
  styleUrls: ['./investigation-form.component.css']
})
export class InvestigationFormComponent implements OnInit, AfterViewInit {

  formModel: FormGroup;
  requestType?: string;
  successResponse: string = "";
  lastSuccessResponseKey: string = "";
  private apiUrl: string = environment.apiUrl;
  
  // Prolog related
  prologProgram: any;
  prologResult: any;
  queryName: any;
  sendQueryButton: any;

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

  ngAfterViewInit(): void {
    this.prologProgram = document.getElementById('program');
    let val;
    if (this.prologProgram) {
      val = this.prologProgram.value;
    }
    this.prologResult = document.getElementById("result");
    this.queryName = document.getElementById("name");
    this.sendQueryButton = document.getElementById("button");
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
        if (data !== null && data.response !== null && data.response !== "") {
          console.log("Form request data received from Mission Control: " + data.response);

          this.successResponse = data.response;
          this.lastSuccessResponseKey = data.eventKey;

          let sm: SMS_CLASS | undefined;          
          sm = new SMS_CLASS(this.lastSuccessResponseKey, ACTORS[ACTORS.Autumn]);
          
          if (sm) {
            this.mainQuestService.TRIGGER_SMS_EVENT.next(sm);            
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
    const path: string = this.apiUrl + routeName;

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
  }
}
