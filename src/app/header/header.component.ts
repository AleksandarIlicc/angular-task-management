import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { AuthService } from "../Services/auth.service";
import { User } from "../Model/User";
import { Subscription } from "rxjs";
import { NavLink } from "../Model/Navlink";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;
  private userSubject: Subscription;

  navLinks: NavLink[] = [
    { label: "Home", routerLink: "/" },
    {
      label: "Dashboard",
      routerLink: "",
      isDropdown: true,
      dropdownLinks: [
        { label: "Overview", routerLink: "dashboard/overview" },
        { label: "Stats", routerLink: "dashboard/stats" },
      ],
    },
    { label: "Login", routerLink: "/login" },
  ];

  ngOnInit() {
    this.userSubject = this.authService.user.subscribe((user: User) => {
      this.isLoggedIn = user ? true : false;
    });
  }

  onLogout() {
    this.OnCloseMenu();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubject.unsubscribe();
  }

  OnOpenMenu() {
    this.isMenuOpen = true;
  }

  OnCloseMenu() {
    this.isMenuOpen = false;
  }

  shouldShowLink(link: NavLink): boolean {
    if (link.label === "Login") {
      return !this.isLoggedIn;
    } else if (link.label === "Dashboard") {
      return this.isLoggedIn;
    }
    return true;
  }
}
