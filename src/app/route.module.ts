import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then(
        (module) => module.DashboardModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/auth.module").then((module) => module.AuthModule),
  },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class RouteModule {}
