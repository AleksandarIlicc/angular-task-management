import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Task } from "src/app/Model/Task";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.css"],
})
export class TaskCardComponent {
  @Input() task: Task;
  @Input() currentUser: string;
  @Output() editTask = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() showDetails = new EventEmitter<string>();
}
