import { Component, OnInit } from '@angular/core';

enum SoilStates {
  EMPTY, SEEDED, CROP
}

@Component({
  selector: 'app-soilinfo',
  templateUrl: './soilinfo.component.html',
  styleUrls: ['./soilinfo.component.css']
})
export class SoilinfoComponent implements OnInit {
  soilType: String = "Meadow";
  soilLevel: Number = 1;
  soilStatus: String = '';

  constructor() { 
  }

  ngOnInit(): void {
  }
}
