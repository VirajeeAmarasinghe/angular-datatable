import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  




@NgModule({
  declarations: [
    
   
  ],
  imports: [
    //BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: []
})
export class AppModule { }