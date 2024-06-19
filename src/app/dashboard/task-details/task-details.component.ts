import { Component, EventEmitter, Output, Input } from "@angular/core";
import { Task } from "src/app/Model/Task";

@Component({
  selector: "app-task-details",
  templateUrl: "./task-details.component.html",
  styleUrls: ["./task-details.component.css"],
})
export class TaskDetailsComponent {
  @Input() currentTask: Task | null = null;
  @Output()
  CloseDetailView: EventEmitter<boolean> = new EventEmitter<boolean>();

  onCloseTaskDetail() {
    this.CloseDetailView.emit();
  }
}
