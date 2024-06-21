import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AuthResponse } from "../Model/AuthResponse";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { User, UserReponse } from "../Model/User";
import { map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthService {
  http: HttpClient = inject(HttpClient);
  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  router: Router = inject(Router);
  private tokenExpiretimer: any;

  signup(
    fullname: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    const data = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    return this.http
      .post<AuthResponse>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
          environment.firebaseAPIKEY,
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleCreateUser(res, fullname);
          this.saveUserToDatabase(res.localId, res.email, fullname).subscribe();
          this.updateUserProfile(res.idToken, fullname).subscribe();
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const data = { email: email, password: password, returnSecureToken: true };

    return this.http
      .post<AuthResponse>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
          environment.firebaseAPIKEY,
        data
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => this.handleCreateUser(res, null))
      );
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate(["/login"]);
    localStorage.removeItem("user");

    if (this.tokenExpiretimer) {
      clearTimeout(this.tokenExpiretimer);
    }
    this.tokenExpiretimer = null;
  }

  autoLogin(): void {
    const user: {
      fullname: string;
      email: string;
      id: string;
      _token: string;
      _expiresIn: string;
    } = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return;
    }

    const loggedUser = new User(
      user.fullname,
      user.email,
      user.id,
      user._token,
      new Date(user._expiresIn)
    );

    if (loggedUser.token) {
      this.user.next(loggedUser);
      const userExpiresIn = new Date(user._expiresIn);
      const timerValue = userExpiresIn.getTime() - new Date().getTime();
      this.autoLogout(timerValue);
    }
  }

  autoLogout(expireTime: number): void {
    this.tokenExpiretimer = setTimeout(() => {
      this.logout();
    }, expireTime);
  }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<UserReponse>(
        "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/users.json"
      )
      .pipe(
        catchError((err) => this.handleUserError(err)),
        map((res) => this.transformResponseToArray(res))
      );
  }

  private handleCreateUser(res: AuthResponse, fullname: string | null): void {
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);
    const user = new User(
      res.displayName || fullname || "",
      res.email,
      res.localId,
      res.idToken,
      expiresIn
    );

    this.user.next(user);
    this.autoLogout(+res.expiresIn * 1000);

    localStorage.setItem("user", JSON.stringify(user));
  }

  private saveUserToDatabase(
    userId: string,
    email: string,
    fullname: string
  ): Observable<User> {
    const user = { id: userId, email, fullname };
    return this.http.post<User>(
      "https://angulartaskmanagement-default-rtdb.europe-west1.firebasedatabase.app/users.json",
      user
    );
  }

  private updateUserProfile(
    token: string,
    displayName: string
  ): Observable<User> {
    const data = {
      idToken: token,
      displayName: displayName,
      returnSecureToken: true,
    };

    return this.http.post<User>(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=" +
        environment.firebaseAPIKEY,
      data
    );
  }

  transformResponseToArray(res: UserReponse) {
    return Object.values(res).map((value) => value);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = "An unknown error has occured";

    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email already exists.";
        break;
      case "OPERATION_NOT_ALLOWED":
        errorMessage = "This operation is not allowed.";
        break;
      case "INVALID_LOGIN_CREDENTIALS":
        errorMessage = "The email ID or Password is not correct.";
        break;
    }
    return throwError(() => errorMessage);
  }

  private handleUserError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = "An unknown error occurred while fetching users.";
    if (err.error && err.error.error) {
      switch (err.error.error.message) {
        case "ACCESS_DENIED":
          errorMessage = "Access to user data is denied.";
          break;
        case "INVALID_TOKEN":
          errorMessage = "The authentication token is invalid.";
          break;
        case "USER_NOT_FOUND":
          errorMessage = "User data not found.";
          break;
      }
    }
    return throwError(() => errorMessage);
  }
}
