import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { App } from './app';
import { FormularioComponent } from './componentes/formulario/formulario';
import { AppRoutingModule } from './app-routing-module';

@NgModule({
  declarations: [App, FormularioComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  bootstrap: [App],
})
export class AppModule {}
