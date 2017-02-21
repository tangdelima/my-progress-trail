import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ProgressListComponent } from './progress-list/progress-list.component';
import { ProgressTrailComponent } from './progress-list/progress-trail/progress-trail.component';
import { ProgressItemComponent } from './progress-list/progress-trail/progress-item.component';
import { MockedService } from './services/mocked.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ProgressListComponent,
    ProgressTrailComponent,
    ProgressItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [MockedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
