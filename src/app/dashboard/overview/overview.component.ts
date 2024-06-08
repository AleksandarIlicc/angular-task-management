import { Component, OnInit, inject } from "@angular/core";
import { Task } from "../../Model/Task";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { TaskService } from "../../Services/task.service";
import { NgForm } from "@angular/forms";
import { AuthService } from "src/app/Services/auth.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {
  http: HttpClient = inject(HttpClient);
  taskService: TaskService = inject(TaskService);
  authService: AuthService = inject(AuthService);

  showCreateTaskForm: boolean = false;
  showTaskDetails: boolean = false;
  allTasks: Task[] = [];
  selectedTask: Task;
  currentTask: Task | null = null;
  currentTaskId: string = "";
  currentUser: string | null = null;
  searchedTasks: Task[] = [];
  searchQuery: string = "";
  isLoading: boolean = false;
  errorMessage: string | null = null;
  editMode: boolean = false;

  statuses = ["open", "started", "in-progress", "complete"];

  tasksByStatus: { [key: string]: Task[] } = {
    open: [],
    started: [],
    "in-progress": [],
    complete: [],
  };

  ngOnInit() {
    this.fetchAllTasks();

    this.authService.user.subscribe((user) => {
      this.currentUser = user?.fullname;
    });
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      title: "",
      desc: "",
      assignedTo: "",
      createdAt: "",
      priority: "",
      status: "",
      author: "",
    };
  }

  showCurrentTaskDetails(id: string | undefined) {
    this.showTaskDetails = true;
    this.taskService.GetTaskDetails(id).subscribe({
      next: (data: Task) => {
        this.currentTask = data;
      },
    });
  }

  CloseTaskDetails(closeForm: boolean) {
    this.showTaskDetails = closeForm;
  }

  CloseCreateTaskForm(closeForm: boolean) {
    this.showCreateTaskForm = closeForm;
  }

  CreateOrUpdateTask(data: Task) {
    const task = { ...data, author: this.currentUser };

    if (!this.editMode) {
      this.taskService.CreateTask(task).subscribe({
        next: (data) => {
          this.fetchAllTasks();
        },
        error: (err) => {
          this.setErrorMessage(err);
        },
      });
    } else {
      this.taskService.UpdateTask(this.currentTaskId, task).subscribe({
        next: (data) => {
          this.fetchAllTasks();
        },
        error: (err) => {
          this.setErrorMessage(err);
        },
      });
    }
  }

  FetchAllTaskClicked() {
    this.fetchAllTasks();
  }

  DeleteTask(id: string | undefined) {
    this.taskService.DeleteTask(id).subscribe({
      next: () => {
        this.fetchAllTasks();
      },
      error: (err) => {
        this.setErrorMessage(err);
      },
    });
  }

  DeleteAllTask() {
    this.taskService.DeleteAllTasks().subscribe({
      next: () => {
        this.fetchAllTasks();
      },
      error: (err) => {
        this.setErrorMessage(err);
      },
    });
  }

  OnEditTaskClicked(id: string | undefined) {
    this.currentTaskId = id;

    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id;
    });
  }

  SearchTask(searchForm: NgForm) {
    this.searchQuery = searchForm.value.searchQuery;
    if (this.searchQuery) {
      this.searchQuery = this.searchQuery.toLowerCase();
    }

    if (searchForm.valid || this.searchQuery === "") {
      this.searchedTasks = this.allTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(this.searchQuery) ||
          task.assignedTo.toLowerCase().includes(this.searchQuery)
      );
    }

    searchForm.reset();
    this.organizetasksByStatus();
  }

  private fetchAllTasks() {
    this.isLoading = true;

    this.taskService.GetAlltasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.searchedTasks = tasks;
        this.organizetasksByStatus();
        this.isLoading = false;
      },
      error: (error) => {
        this.setErrorMessage(error);
        this.isLoading = false;
      },
    });
  }

  private setErrorMessage(err: HttpErrorResponse) {
    if (err.error.error === "Permission denied") {
      this.errorMessage = "You do not have permisssion to perform this action";
    } else {
      this.errorMessage = err.message;
    }

    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  private organizetasksByStatus() {
    // return this.searchedTasks.reduce((acc, task) => {
    //   if (!acc[task.status]) {
    //     acc[task.status] = [];
    //   }
    //   acc[task.status].push(task);
    //   return acc;
    // }, {});

    this.statuses.forEach((status) => {
      this.tasksByStatus[status] = this.searchedTasks.filter(
        (task) => task.status === status
      );
    });
  }
}
