import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  inject,
} from "@angular/core";

@Directive({
  selector: "[setStatusBackground]",
})
export class SetStatusBackground implements OnInit {
  renderer: Renderer2 = inject(Renderer2);
  @Input() statusStyle: string;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.renderer.addClass(
      this.element.nativeElement,
      "task-status-" + this.statusStyle
    );
  }
}
