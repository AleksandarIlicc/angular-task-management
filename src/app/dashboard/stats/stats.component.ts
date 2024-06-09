import { Component, OnInit, inject } from "@angular/core";
import { Task } from "src/app/Model/Task";
import { TaskService } from "src/app/Services/task.service";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.css"],
})
export class StatsComponent implements OnInit {
  taskService: TaskService = inject(TaskService);
  tasks: Task[] = [];
  taskCountsByStatus: { [status: string]: number } = {};

  ngOnInit(): void {
    this.taskService.GetAlltasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.countTasksByStatus();
      this.renderChart();
    });
  }

  private countTasksByStatus(): void {
    this.taskCountsByStatus = {
      open: 0,
      started: 0,
      "in-progress": 0,
      complete: 0,
    };

    this.taskCountsByStatus = this.tasks.reduce((counts, task) => {
      counts[task.status] = (counts[task.status] || 0) + 1;
      return counts;
    }, this.taskCountsByStatus);
  }

  private renderChart(): void {
    const canvas = document.getElementById("taskChart") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(this.taskCountsByStatus),
        datasets: [
          {
            data: Object.values(this.taskCountsByStatus),
            backgroundColor: [
              "#ff5733", // Open
              "#336bff", // Started
              "#ffa933", // In Progress
              "#43e870", // Complete
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
