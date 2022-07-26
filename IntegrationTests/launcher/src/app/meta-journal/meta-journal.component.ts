import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meta-journal',
  templateUrl: './meta-journal.component.html',
  styleUrls: ['./meta-journal.component.css']
})
export class MetaJournalComponent implements OnInit {

  activeText: string = "cover-letter";

  constructor() { }

  ngOnInit(): void {
  }

  public setActiveText(textName: string) {
    this.activeText = textName;
  }

}
