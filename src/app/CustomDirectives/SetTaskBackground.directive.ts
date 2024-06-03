import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  inject,
} from "@angular/core";

@Directive({
  selector: "[setTaskBackground]",
})
export class SetTaskBackground implements OnInit {
  renderer: Renderer2 = inject(Renderer2);
  @Input() status: string = "#ff5733";

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.renderer.addClass(this.element.nativeElement, `task-${this.status}`);
  }
}
