import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SoilinfoComponent } from './soilinfo/soilinfo.component';
import { SoilpatchComponent } from './soilpatch/soilpatch.component';
import { SoildisplayComponent } from './soildisplay/soildisplay.component';

@NgModule({
  declarations: [
    AppComponent,
    SoilinfoComponent,
    SoilpatchComponent,
    SoildisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
