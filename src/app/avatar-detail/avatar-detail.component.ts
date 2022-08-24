import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar-detail',
  templateUrl: './avatar-detail.component.html',
  styleUrls: ['./avatar-detail.component.css']
})
export class AvatarDetailComponent implements OnInit {
  @Input() public currentLevel: number = 1;
  @Input() public currentExperience: number = 0;
  @Input() public experienceTotalRequired: number = 100;
  @Input() public currentHealth: number = 100;

  constructor() {}

  ngOnInit(): void {
    
  }
}
