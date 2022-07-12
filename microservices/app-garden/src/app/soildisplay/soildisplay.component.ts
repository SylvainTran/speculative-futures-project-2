import { Component, OnInit } from '@angular/core';

interface SoilPatch {
  state: String
}

class SoilPatch {
 
  constructor(private soilContents: string) {
  }

  getSoilContents() {
    return this.soilContents;
  }
 
  examine() {
    return "Hello, I'm a " + this.soilContents;
  }
}

class EmptySoilPatch extends SoilPatch {
  constructor(soilContents: string) {
    super(soilContents);
  }
}

@Component({
  selector: 'app-soildisplay',
  templateUrl: './soildisplay.component.html',
  styleUrls: ['./soildisplay.component.css']
})
export class SoildisplayComponent implements OnInit {
  soilPatches: SoilPatch[] = [];

  constructor() {
    this.soilPatches.push(new SoilPatch("This soil patch contains a Raddish"), new EmptySoilPatch("This soil patch is empty"));
   }

  ngOnInit(): void {
  }

}
