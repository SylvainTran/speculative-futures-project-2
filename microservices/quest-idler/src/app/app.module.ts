import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FriendListService } from './friend-list.service';
import { MockFriendList } from './mockfriendlist';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AvatarDisplayComponent } from './avatar-display/avatar-display.component';
import { FriendDetailComponent } from './friend-detail/friend-detail.component';
import { AvatarDetailComponent } from './avatar-detail/avatar-detail.component';
import { AvatarControllerService } from './avatar-controller.service';
import { AvatarStatsComponent } from './avatar-stats/avatar-stats.component';
import { CollectablesComponent } from './collectables/collectables.component';
import { FriendListComponent } from './friend-list/friend-list.component';

// Move into naming service
export const AVATAR_NAME = new InjectionToken<string>('AVATAR_NAME', {     
  providedIn: 'root',
  factory: () => 'Myella'
});

@NgModule({
  declarations: [
    AppComponent,
    AvatarDisplayComponent,
    FriendDetailComponent,
    AvatarDetailComponent,
    AvatarStatsComponent,
    CollectablesComponent,
    FriendListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{ provide: AVATAR_NAME, useValue: 'Myella' },
              { provide: FriendListService, useClass: FriendListService }, 
              { provide: MockFriendList, useClass: MockFriendList },
              { provide: AvatarControllerService, useClass: AvatarControllerService}
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
