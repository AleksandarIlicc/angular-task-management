import { Component, OnInit, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, map, take } from "rxjs";
import { NgForm } from "@angular/forms";
import { TaskService } from "../../Services/task.service";
import { AuthService } from "src/app/Services/auth.service";
import { Task } from "../../Model/Task";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {
  taskService: TaskService = inject(TaskService);
  authService: AuthService = inject(AuthService);

  showCreateTaskForm: boolean = false;
  showTaskDetails: boolean = false;
  showTaskDeleteModal: boolean = false;
  editMode: boolean = false;

  // allTasks: Task[] = [];
  allTasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  // filteredTasks: Task[] = [];
  filteredTasks$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  // currentUser: string | null = null;
  currentUser$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  // isLoading: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // errorMessage: string | null = null;
  errorMessage$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  selectedTask: Task = {
    title: "",
    desc: "",
    assignedTo: "",
    createdAt: "",
    priority: "",
    status: "",
    author: "",
  };
  currentTask: Task | null = null;
  currentTaskId: string = "";
  taskToDeleteId: string = "";
  searchQuery: string = "";

  statuses = ["open", "started", "in-progress", "complete"];

  tasksByStatus$: BehaviorSubject<{ [key: string]: Task[] }> =
    new BehaviorSubject<{ [key: string]: Task[] }>({
      open: [],
      started: [],
      "in-progress": [],
      complete: [],
    });

  ngOnInit(): void {
    this.fetchAllTasks();

    // this.authService.user.subscribe((user) => {
    //   this.currentUser = user?.fullname || null;
    // });
    this.authService.user
      .pipe(map((user) => user?.fullname || null))
      .subscribe((fullname) => {
        this.currentUser$.next(fullname);
      });
  }

  OpenCreateTaskForm(): void {
    this.showCreateTaskForm = true;
    this.editMode = false;
  }

  OpenTaskDeleteDialog(): void {
    this.showTaskDeleteModal = true;
  }

  showCurrentTaskDetails(id: string | undefined): void {
    this.showTaskDetails = true;
    this.taskService.GetTaskDetails(id).subscribe({
      next: (data: Task) => {
        this.currentTask = data;
      },
    });
  }

  closeTaskDetails(): void {
    this.showTaskDetails = false;
  }

  closeTaskDeleteDialog(): void {
    this.showTaskDeleteModal = false;
  }

  successDeletedTask(): void {
    this.showTaskDeleteModal = false;
    this.fetchAllTasks();
  }

  closeCreateTaskForm(): void {
    this.currentTaskId = "";
    this.showCreateTaskForm = false;
  }

  createOrUpdateTask(data: Task): void {
    // const currentUser = this.currentUser$.getValue();

    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      const task = { ...data, author: currentUser };

      if (!this.editMode) {
        this.taskService.CreateTask(task).subscribe({
          next: () => {
            this.fetchAllTasks();
          },
          error: (err) => {
            this.setErrorMessage(err);
          },
        });
      } else {
        this.taskService.UpdateTask(this.currentTaskId, task).subscribe({
          next: () => {
            this.fetchAllTasks();
          },
          error: (err) => {
            this.setErrorMessage(err);
          },
        });
      }
    });
  }

  FetchAllTaskClicked(): void {
    this.fetchAllTasks();
  }

  DeleteTask(id: string | undefined): void {
    this.taskToDeleteId = id;
    this.OpenTaskDeleteDialog();
  }

  DeleteAllTask(): void {
    this.taskService.DeleteAllTasks().subscribe({
      next: () => {
        this.fetchAllTasks();
      },
      error: (err) => {
        this.setErrorMessage(err);
      },
    });
  }

  OnEditTaskClicked(id: string | undefined): void {
    this.currentTaskId = id;

    this.showCreateTaskForm = true;
    this.editMode = true;

    // this.selectedTask = this.allTasks.find((task) => {
    //   return task.id === id;
    // });
    this.allTasks$.subscribe((allTasks) => {
      this.selectedTask = allTasks.find((task) => task.id === id);
    });
  }

  SearchTask(searchForm: NgForm): void {
    this.searchQuery = searchForm.value.searchQuery?.toLowerCase() || "";

    if (searchForm.valid || this.searchQuery === "") {
      // this.filteredTasks = this.allTasks.filter(
      //   (task) =>
      //     task.title.toLowerCase().includes(this.searchQuery) ||
      //     task.assignedTo.toLowerCase().includes(this.searchQuery)
      // );

      const filteredTasks = this.allTasks$
        .getValue()
        .filter(
          (task) =>
            task.title.toLowerCase().includes(this.searchQuery) ||
            task.assignedTo.toLowerCase().includes(this.searchQuery)
        );
      this.filteredTasks$.next(filteredTasks);
      this.organizeTasksByStatus();
    }

    searchForm.reset();
  }

  private fetchAllTasks() {
    // this.isLoading = true;
    this.isLoading$.next(true);

    this.taskService.GetAlltasks().subscribe({
      next: (tasks: Task[]) => {
        // this.allTasks = tasks;
        // this.filteredTasks = tasks;
        this.allTasks$.next(tasks);
        this.filteredTasks$.next(tasks);
        this.organizeTasksByStatus();
        // this.isLoading = false;
        this.isLoading$.next(false);
      },
      error: (error) => {
        this.setErrorMessage(error);
        // this.isLoading = false;
        this.isLoading$.next(false);
      },
    });
  }

  private setErrorMessage(err: HttpErrorResponse) {
    if (err.error.error === "Permission denied") {
      // this.errorMessage = "You do not have permisssion to perform this action";
      this.errorMessage$.next(
        "You do not have permisssion to perform this action"
      );
    } else {
      // this.errorMessage = err.message;
      this.errorMessage$.next(err.message);
    }

    setTimeout(() => {
      // this.errorMessage = null;
      this.errorMessage$.next(null);
    }, 3000);
  }

  // private organizeTasksByStatus() {
  //   this.statuses.forEach((status) => {
  //     this.tasksByStatus$[status] = this.filteredTasks$.pipe(
  //       map((tasks) => tasks.filter((task) => task.status === status))
  //     );
  //   });
  // }
  private organizeTasksByStatus() {
    const organizedTasks = {
      open: [],
      started: [],
      "in-progress": [],
      complete: [],
    };

    const allTasks = this.filteredTasks$.getValue();

    allTasks.forEach((task) => {
      organizedTasks[task.status].push(task);
    });

    this.tasksByStatus$.next(organizedTasks);
  }
}
