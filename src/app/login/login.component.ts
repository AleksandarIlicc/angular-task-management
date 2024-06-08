import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../Services/auth.service";
import { Observable } from "rxjs";
import { AuthResponse } from "../Model/AuthResponse";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild("authForm") authForm: NgForm;
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  isSubmitted: boolean = false;
  authObs: Observable<AuthResponse>;
  fullname: string = "";
  email: string = "";
  password: string = "";

  ngOnInit(): void {
    this.resetFormState();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
  }

  onFormSubmitted(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const fullname = this.fullname;
    const email = form.value.email;
    const password = form.value.password;

    this.setLoading(true);

    if (this.isLoginMode) {
      this.authObs = this.authService.login(email, password);
    } else {
      this.authObs = this.authService.signup(fullname, email, password);
    }

    this.authObs.subscribe({
      next: (res) => {
        this.onSuccess();
      },
      error: (errMsg) => {
        this.onError(errMsg);
      },
    });
    form.reset();
  }

  canExit() {
    if ((this.email || this.password || this.fullname) && !this.isSubmitted) {
      return confirm("You have unsaved changes. Do you want to navigate away?");
    } else {
      return true;
    }
  }

  hideSnackbar() {
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  private setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  private onSuccess() {
    this.isSubmitted = true;
    this.setLoading(false);
    this.router.navigate(["/dashboard/overview"]);
  }

  private onError(errorMessage) {
    this.setLoading(false);
    this.errorMessage = errorMessage;
    this.hideSnackbar();
  }

  private resetFormState() {
    this.isLoginMode = true;
    this.isLoading = false;
    this.errorMessage = null;
    this.isSubmitted = false;
  }
}
