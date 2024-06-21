import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { CreateTaskComponent } from "./create-task/create-task.component";
import { TaskDetailsComponent } from "./task-details/task-details.component";
import { OverviewComponent } from "./overview/overview.component";
import { StatsComponent } from "./stats/stats.component";
import { TaskCardComponent } from "./task-card/task-card.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared.module";
import { DashboardRouteModule } from "./dashboard-route.module";
import { SetTaskBackground } from "../CustomDirectives/SetTaskBackground.directive";
import { SetStatusBackground } from "../CustomDirectives/SetStatusBackground.directive";
import { DeleteTaskDialogComponent } from "./delete-task-dialog/delete-task-dialog.component";
import { TaskStatusContainerComponent } from './task-status-container/task-status-container.component';

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
    DeleteTaskDialogComponent,
    TaskStatusContainerComponent,
  ],
  imports: [CommonModule, SharedModule, DashboardRouteModule],
  exports: [SharedModule],
})
export class DashboardModule {}
