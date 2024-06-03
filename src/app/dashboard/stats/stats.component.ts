import { Component, OnInit, inject } from "@angular/core";
import { Task } from "src/app/Model/Task";
import { TaskService } from "src/app/Services/task.service";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"],
})
export class StatsComponent implements OnInit {
  open: number = 0;
  started: number = 0;
  inprogress: number = 0;
  complete: number = 0;
  total: number = 0;
  tasks: Task[] = [];

  taskService: TaskService = inject(TaskService);

  ngOnInit(): void {
    this.taskService.GetAlltasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.open = tasks.filter((task) => task.status === "open").length;
      this.started = tasks.filter((task) => task.status === "started").length;
      this.inprogress = tasks.filter(
        (task) => task.status === "in-progress"
      ).length;
      this.complete = tasks.filter((task) => task.status === "complete").length;
      this.total = tasks.length;
    });
  }
}
