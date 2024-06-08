import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  OnInit,
  inject,
  AfterViewInit,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Task } from "src/app/Model/Task";
import { AuthService } from "src/app/Services/auth.service";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.component.html",
  styleUrls: [],
})
export class CreateTaskComponent implements OnInit, AfterViewInit {
  authService: AuthService = inject(AuthService);
  @Input() isEditMode: boolean = false;
  @Input() selectedTask: Task;
  @ViewChild("taskForm") taskForm: NgForm;
  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  EmitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  priorityOptions = ["Low", "Medium", "High", "Critical"];

  statusOptions = ["Open", "Started", "In-progress", "Complete"];

  defaultAssignedTo: string = "Low";
  defaultPriority: string = "Low";
  defaultStatus: string = "Open";

  usersList = [];

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe({
      next: (res) => {
        this.usersList = res;
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.taskForm.form.patchValue(this.selectedTask);
    }, 0);
  }

  OnCloseForm() {
    this.CloseForm.emit(false);
  }

  OnFormSubmitted(form: NgForm) {
    this.EmitTaskData.emit(form.value);
    this.OnCloseForm();
  }
}
