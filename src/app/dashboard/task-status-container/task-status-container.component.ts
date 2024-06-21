import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Task } from "src/app/Model/Task";

@Component({
  selector: "app-task-status-container",
  templateUrl: "./task-status-container.component.html",
  styleUrls: ["./task-status-container.component.css"],
})
export class TaskStatusContainerComponent {
  @Input() status: string;
  @Input() tasks: Task[] = [] as Task[];
  @Input() currentUser: string;
  @Output() editTask = new EventEmitter<string>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() showDetails = new EventEmitter<string>();
  @Output() createTask = new EventEmitter();
}
