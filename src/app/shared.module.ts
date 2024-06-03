import { NgModule } from "@angular/core";
import { LoaderComponent } from "./utility/loader/loader.component";
import { FormsModule } from "@angular/forms";
import { SnackbarComponent } from "./utility/snackbar/snackbar.component";

@NgModule({
  declarations: [LoaderComponent, SnackbarComponent],
  imports: [FormsModule],
  exports: [LoaderComponent, SnackbarComponent, FormsModule],
})
export class SharedModule {}
