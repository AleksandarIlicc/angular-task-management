import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LoggingService {
  http: HttpClient = inject(HttpClient);
  logError(data: { statusCode: number; errorMessage: string; datetime: Date }) {
    this.http
      .post(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/log.json",
        data
      )
      .subscribe();
  }

  fetcherrors() {
    this.http
      .get(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/log.json"
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
}
