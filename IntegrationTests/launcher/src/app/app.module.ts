// Modules
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

// Services
import { FriendListService } from './services/friend-list.service';
import { MockFriendList } from './services/mockfriendlist';
import { CharacterDatabaseService } from './services/character-database.service';
import { FriendCallerService } from './services/friend-caller.service';
import { AvatarExperienceService } from './services/avatar-experience.service';
import { AvatarStatisticsService } from './services/avatar-statistics.service';
import { QuestPartyService } from './services/quest-party.service';
import { AvatarControllerService } from './services/avatar-controller.service';

// Components
import { AppComponent } from './app.component';
import { AvatarDisplayComponent } from './avatar-display/avatar-display.component';
import { FriendDetailComponent } from './friend-detail/friend-detail.component';
import { AvatarDetailComponent } from './avatar-detail/avatar-detail.component';
import { AvatarStatsComponent } from './avatar-stats/avatar-stats.component';
import { CollectablesComponent } from './collectables/collectables.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { PartyDungeonViewComponent } from './party-dungeon-view/party-dungeon-view.component';
import { SinglePlayerViewComponent } from './single-player-view/single-player-view.component';
import { AvatarPartyDisplayComponent } from './avatar-party-display/avatar-party-display.component';
import { ChatDisplayComponent } from './chat-display/chat-display.component';
import { QuestIdlerComponent } from './quest-idler/quest-idler.component';
import { ChatHomesComponent } from './chat-homes/chat-homes.component';
import { MetaFriendListComponent } from './meta-friend-list/meta-friend-list.component';
import { MetaMessageCenterComponent } from './meta-message-center/meta-message-center.component';
import { MetaJournalComponent } from './meta-journal/meta-journal.component';
import { MenuInterfaceComponent } from './menu-interface/menu-interface.component';

// Material CDK
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

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
    FriendListComponent,
    PartyDungeonViewComponent,
    SinglePlayerViewComponent,
    AvatarPartyDisplayComponent,
    ChatDisplayComponent,
    QuestIdlerComponent,
    ChatHomesComponent,
    MetaFriendListComponent,
    MenuInterfaceComponent,
    MetaMessageCenterComponent,
    MetaJournalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    CdkTreeModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule
  ],
  providers: [{ provide: AVATAR_NAME, useValue: 'Autumn' },
              { provide: FriendListService, useClass: FriendListService }, 
              { provide: MockFriendList, useClass: MockFriendList },
              { provide: AvatarControllerService, useClass: AvatarControllerService },
              { provide: AvatarStatisticsService, useClass: AvatarStatisticsService },
              { provide: AvatarExperienceService, useClass: AvatarExperienceService },
              { provide: CharacterDatabaseService, useClass: CharacterDatabaseService },
              { provide: QuestPartyService, useClass: QuestPartyService },
              { provide: FriendCallerService, useClass: FriendCallerService }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
