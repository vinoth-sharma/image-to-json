import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropDirective } from './drag-drop.directive';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DragDropDirective,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, MatSnackBarModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
