export interface NavLink {
  label: string;
  routerLink: string;
  isDropdown?: boolean;
  dropdownLinks?: NavLink[];
}
