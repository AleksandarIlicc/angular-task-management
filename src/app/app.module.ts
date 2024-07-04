import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./footer/footer.component";

import { RouteModule } from "./route.module";
import { CoreModule } from "./core.module";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomeComponent, FooterComponent, PageNotFoundComponent],
  imports: [BrowserModule, HttpClientModule, RouteModule, CoreModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
