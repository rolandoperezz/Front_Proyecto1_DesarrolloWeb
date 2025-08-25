import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarcadorComponent } from './pages/marcador/marcador.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [
    AppComponent,
    MarcadorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    ToggleButtonModule,
    DividerModule,
    BadgeModule,
    ToastModule,
    ColorPickerModule,
    OverlayPanelModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
