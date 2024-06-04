import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { CreateTaskComponent } from "./create-task/create-task.component";
import { TaskDetailsComponent } from "./task-details/task-details.component";
import { OverviewComponent } from "./overview/overview.component";
import { StatsComponent } from "./stats/stats.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared.module";
import { DashboardRouteModule } from "./dashboard-route.module";
import { SetTaskBackground } from "../CustomDirectives/SetTaskBackground.directive";
import { SetStatusBackground } from "../CustomDirectives/SetStatusBackground.directive";
import { TaskCardComponent } from "./task-card/task-card.component";

@NgModule({
  declarations: [
    DashboardComponent,
    CreateTaskComponent,
    TaskDetailsComponent,
    OverviewComponent,
    StatsComponent,
    SetTaskBackground,
    SetStatusBackground,
    TaskCardComponent,
  ],
  imports: [CommonModule, SharedModule, DashboardRouteModule],
  exports: [SharedModule],
})
export class DashboardModule {}
