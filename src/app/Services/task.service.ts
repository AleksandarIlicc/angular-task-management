import { Injectable, inject } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { LoggingService } from "./Logging.Service";
import { AuthService } from "./auth.service";
import { ApiResponse, Task } from "../Model/Task";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private readonly BASE_URL =
    "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/tasks";

  http: HttpClient = inject(HttpClient);
  loggingService: LoggingService = inject(LoggingService);
  authService: AuthService = inject(AuthService);

  GetAlltasks(): Observable<Task[]> {
    return this.http.get<ApiResponse>(`${this.BASE_URL}.json`).pipe(
      map((response) => this.transformResponseToArray(response)),
      catchError((err) => this.handleError(err))
    );
  }

  GetTaskDetails(id: string | undefined): Observable<Task> {
    return this.http
      .get<Task>(`${this.BASE_URL}/${id}.json`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  CreateTask(task: Task): Observable<{ name: string }> {
    const headers = new HttpHeaders({ "my-header": "hello-world" });

    return this.http
      .post<{ name: string }>(`${this.BASE_URL}.json`, task, { headers })
      .pipe(catchError((err) => this.handleError(err)));
  }

  UpdateTask(id: string | undefined, data: Task): Observable<Task> {
    return this.http
      .put<Task>(`${this.BASE_URL}/${id}.json`, data)
      .pipe(catchError((err) => this.handleError(err)));
  }

  DeleteTask(id: string | undefined): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/${id}.json`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  DeleteAllTasks(): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}.json`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  private transformResponseToArray(response: ApiResponse): Task[] {
    return Object.keys(response).map((key) => ({ ...response[key], id: key }));
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
