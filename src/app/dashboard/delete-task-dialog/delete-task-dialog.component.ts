import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { TaskService } from "src/app/Services/task.service";

@Component({
  selector: "app-delete-task-dialog",
  templateUrl: "./delete-task-dialog.component.html",
  styleUrls: ["./delete-task-dialog.component.css"],
})
export class DeleteTaskDialogComponent {
  taskService: TaskService = inject(TaskService);
  @Input() currentTaskId: string = "";
  @Output() CloseTaskDeleteModal: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() SuccessDeletedTask: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  errorMessage: string | null = null;

  onDeleteTask() {
    this.taskService.DeleteTask(this.currentTaskId).subscribe({
      next: () => {
        this.SuccessDeletedTask.emit();
      },
      error: (err) => {
        this.setErrorMessage(err);
      },
    });
  }

  onCancelDeleteTask() {
    this.CloseTaskDeleteModal.emit();
  }

  onCloseTaskDeleteDialog() {
    this.CloseTaskDeleteModal.emit();
  }

  private setErrorMessage(err: HttpErrorResponse) {
    if (err.error.error === "Permission denied") {
      this.errorMessage = "You do not have permisssion to perform this action";
    } else if (err.error.error === "Invalid path: Invalid token in path") {
      this.errorMessage =
        "Invalid path: The provided token in the path is invalid.";
    } else {
      this.errorMessage = err.message;
    }

    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
