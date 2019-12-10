import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HelloComponent } from './hello/hello.component';
import { httpInterceptorProviders } from './http-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HelloComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    httpInterceptorProviders,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
