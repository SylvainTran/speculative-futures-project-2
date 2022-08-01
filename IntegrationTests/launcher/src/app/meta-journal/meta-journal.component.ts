import { Component, OnInit } from '@angular/core';

class Attachment {
  visible: boolean = false;
  constructor() {}
}

@Component({
  selector: 'app-meta-journal',
  templateUrl: './meta-journal.component.html',
  styleUrls: ['./meta-journal.component.css']
})
export class MetaJournalComponent implements OnInit {

  activeText: string = "cover-letter";
  showAttachments: boolean = false;
  attachments: Attachment[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  public setActiveText(textName: string) {
    this.activeText = textName;
  }

  public showAttachment(index: number) {
    this.attachments[index].visible = true;
    console.log("SHOWING INDEX : " + index);
  }
}
