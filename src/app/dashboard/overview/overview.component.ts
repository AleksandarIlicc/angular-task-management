import { Component, OnInit, inject } from "@angular/core";
import { Task } from "../../Model/Task";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { TaskService } from "../../Services/task.service";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {
  http: HttpClient = inject(HttpClient);
  taskService: TaskService = inject(TaskService);
  showCreateTaskForm: boolean = false;
  showTaskDetails: boolean = false;
  allTasks: Task[] = [];
  selectedTask: Task;
  currentTask: Task | null = null;
  currentTaskId: string = "";
  searchedTasks: Task[] = [];
  searchQuery: string = "";
  isLoading: boolean = false;
  errorMessage: string | null = null;
  editMode: boolean = false;
  errorSub: Subscription;

  statuses = ["open", "started", "in-progress", "complete"];

  tasksByStatus: { [key: string]: Task[] } = {
    open: [],
    started: [],
    "in-progress": [],
    complete: [],
  };

  ngOnInit() {
    this.fetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({
      next: (httpError) => {
        this.setErrorMessage(httpError);
      },
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
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
    };
  }

  showCurrentTaskDetails(id: string | undefined) {
    this.showTaskDetails = true;
    this.taskService.getTaskDetails(id).subscribe({
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
    if (!this.editMode) {
      this.taskService.CreateTask(data);
    } else {
      this.taskService.UpdateTask(this.currentTaskId, data);
    }
  }

  FetchAllTaskClicked() {
    this.fetchAllTasks();
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

  DeleteTask(id: string | undefined) {
    this.taskService.DeleteTask(id);
  }

  DeleteAllTask() {
    this.taskService.DeleteAllTasks();
  }

  OnEditTaskClicked(id: string | undefined) {
    this.currentTaskId = id;

    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id;
    });
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
}
