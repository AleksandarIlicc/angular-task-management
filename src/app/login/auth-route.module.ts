import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login.component";
import { canDeactivate } from "../RouteGuards/authGuard";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
    canDeactivate: [canDeactivate],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouteModule {}
