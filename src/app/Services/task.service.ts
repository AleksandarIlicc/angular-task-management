import { Injectable, inject } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Task } from "../Model/Task";
import { map, catchError, tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { LoggingService } from "./Logging.Service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  http: HttpClient = inject(HttpClient);
  loggingService: LoggingService = inject(LoggingService);
  authService: AuthService = inject(AuthService);

  GetAlltasks() {
    return this.http
      .get(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
      )
      .pipe(
        map((response) => this.transformResponseToArray(response)),
        catchError((err) => this.handleError(err))
      );
  }

  GetTaskDetails(id: string | undefined) {
    return this.http
      .get(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/tasks/" +
          id +
          ".json"
      )
      .pipe(catchError((err) => this.handleError(err)));
  }

  CreateTask(task: Task) {
    const headers = new HttpHeaders({ "my-header": "hello-world" });

    return this.http
      .post<{ name: string }>(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/tasks.json",
        task,
        { headers: headers }
      )
      .pipe(catchError((err) => this.handleError(err)));
  }

  UpdateTask(id: string | undefined, data: Task) {
    return this.http
      .put(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/tasks/" +
          id +
          ".json",
        data
      )
      .pipe(catchError((err) => this.handleError(err)));
  }

  DeleteTask(id: string | undefined) {
    return this.http
      .delete(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/tasks/" +
          id +
          ".json"
      )
      .pipe(catchError((err) => this.handleError(err)));
  }

  DeleteAllTasks() {
    return this.http
      .delete(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/tasks.json",
        { observe: "events", responseType: "json" }
      )
      .pipe(catchError((err) => this.handleError(err)));
  }

  private transformResponseToArray(response: any): Task[] {
    const tasks: Task[] = [];
    for (const key in response) {
      if (response.hasOwnProperty(key)) {
        tasks.push({ ...response[key], id: key });
      }
    }
    return tasks;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorObj = {
      statusCode: error.status,
      errorMessage: error.message,
      datetime: new Date(),
    };
    this.loggingService.logError(errorObj);
    return throwError(() => error);
  }
}
