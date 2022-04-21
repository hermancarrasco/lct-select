import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Subject} from "rxjs";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'lct-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputTextComponent,
    multi: true
  }]
})
export class InputTextComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @Input() disabled = false;
  @Input() icon = ''
  @Input() iconPosition: 'left' | 'right' = 'right';
  @Input() pdaAutoEnter = false;
  @Input() placeholder = '';
  @Input() showIcon = false;
  @Input() title = 'Insert Title';
  @Input() type: 'email' | 'number' | 'text' = 'text';
  @Output() enterEmitted = new EventEmitter<string>()
  @Output() iconClick = new EventEmitter();
  @Output() inputClick = new EventEmitter();
  @ViewChild('inputScan') inputScan: ElementRef | undefined;
  @ViewChild('iconDiv') iconDiv: ElementRef | undefined;

  inputValue = '';
  public lpnUpdate = new Subject<string>();

  public propagateChange = (_: any) => { };

  constructor(private render: Renderer2) {
  }

  ngAfterViewInit() {
    if (this.iconPosition === "left" && this.showIcon) {
      this.render.addClass(this.inputScan?.nativeElement, 'iconLeft')
      this.render.addClass(this.iconDiv?.nativeElement, 'iconLeft')
    }
    if (this.pdaAutoEnter) {
      this.lpnUpdate
        .pipe(
          debounceTime(200),
          distinctUntilChanged()
        )
        .subscribe(async value => {
          if (value) {
            this.enterEmit();
          } else {
            return;
          }
        });
    }
  }

  ngOnInit(): void {
  }

  writeValue(value: any): void {
    if (typeof value !== 'undefined') {
      this.onKeyUpHandler(value);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // console.log('reg touch', fn)
  }

  onKeyUpHandler(event?: KeyboardEvent | string) {
    if (!this.inputValue && typeof event === 'string') {
      this.inputValue = event;
    }
    if (this.inputValue && event === null){
      this.inputValue = '';
    }
    this.propagateChange(this.inputValue);
  }

  click() {
    if (!this.disabled) {
      this.iconClick.emit('iconClick')
    }
  }

  clickInput( ) {
    if (!this.disabled) {
      this.inputClick.emit('inputClick')
    }
  }

  enterEmit() {
    if (this.inputValue) {
      this.enterEmitted.emit(this.inputValue);
    }
  }

}
