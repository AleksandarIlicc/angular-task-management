import { NgModule } from "@angular/core";
import { LoginComponent } from "./login.component";
import { SharedModule } from "../shared.module";
import { CommonModule } from "@angular/common";
import { AuthRouteModule } from "./auth-route.module";

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, SharedModule, AuthRouteModule],
  exports: [LoginComponent],
})
export class AuthModule {}
