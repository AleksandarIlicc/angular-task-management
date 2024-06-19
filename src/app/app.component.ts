import { Component, OnInit, inject } from "@angular/core";
import { AuthService } from "./Services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  title = "angular-http-client";

  students = [
    { name: "Alice", age: 22, grade: 83, subjects: ["Math", "Physics", "Eng"] },
    { name: "Bob", age: 20, grade: 93, subjects: ["Math", "Chemistry"] },
    {
      name: "Charlie",
      age: 23,
      grade: 79,
      subjects: ["Physics", "Biology", "Chemistry", "Eng"],
    },
    {
      name: "David",
      age: 21,
      grade: 88,
      subjects: ["Math", "Biology", "Chemistry"],
    },
    { name: "Eve", age: 22, grade: 95, subjects: ["Chemistry", "Physics"] },
  ];

  ngOnInit() {
    // Napraviti niz svih predmeta koje studenti pohađaju bez duplikata.

    const arr = [
      ...new Set(this.students.flatMap((student) => student.subjects)),
    ];

    console.log(arr);

    this.authService.autoLogin();
  }
}
