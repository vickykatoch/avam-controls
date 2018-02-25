import { Component, forwardRef, Input, Output, HostBinding, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'avam-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropDownComponent),
    multi: true
  }]
})
export class DropDownComponent implements ControlValueAccessor {
  @Input() selectedValue: any;
  @Input() displayField: string;
  @Input() listItems: any[];
  @ViewChild('input') input: ElementRef;
  @ViewChild('btn') btn: ElementRef;

  @Input() dropDirection: string = 'BOTTOM';
  private ddMenu: HTMLUListElement;
  private _isSearchable = false;
  private isDisable = false;
  isDropListVisible = false;
  hasFocus = false;
  // @Input() visibleItemsCount : number;
  private subscriptions: Subscription[] = [];

  onChange = (rating: number) => { };
  onTouched = () => { };


  constructor(private renderer: Renderer2, private elRef: ElementRef) { }

  ngOnInit() {
    !this._isSearchable && this.renderer.setAttribute(this.input.nativeElement, 'readonly', '');
    this.subscriptions.push(merge(
      fromEvent(this.input.nativeElement, 'focus'),
      fromEvent(this.btn.nativeElement, 'focus'),
      // fromEvent(this.ddMenu.nativeElement, 'focus')
    ).subscribe(this.onFocus.bind(this)));
    this.subscriptions.push(merge(
      fromEvent(this.input.nativeElement, 'blur'),
      fromEvent(this.btn.nativeElement, 'blur'),
      // fromEvent(this.ddMenu.nativeElement, 'blur')
    ).subscribe(this.onBlur.bind(this)));
    this.subscriptions.push(fromEvent(this.input.nativeElement, 'click')
      .subscribe(this.onInputClick.bind(this)));

  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  @Input() set disabled(value: boolean) {
    this.setDisabledState(value);
  }
  @Input() set isSearchable(value: boolean) {
    if (value) {
      this.renderer.setAttribute(this.input.nativeElement, 'readonly', '');
    } else {
      this.renderer.removeAttribute(this.input.nativeElement, 'readonly');
    }
  }
  @Input() set showDropDown(value: boolean) {
    this.renderer.setStyle(this.btn.nativeElement,'display',value ? '' : 'none');
  }
  @HostBinding('style.opacity')
  get opacity() {
    return this.isDisable ? 0.25 : 1;
  }
  // Value and getDisplayValue methods can be merged
  get value(): string {
    if (this.selectedValue === undefined || this.selectedValue === null) {
      return '';
    }
    if (typeof this.selectedValue === 'object') {
      return this.displayField ? this.selectedValue[this.displayField] : this.selectedValue.toString();
    }
    if (typeof this.selectedValue === 'string') {
      return this.selectedValue;
    }
    return '';
  }
  getDisplayValueForItem(item: any): string {
    if (this.displayField) {
      if (item && this.displayField in item) {
        return item[this.displayField];
      } else {
        return item;
      }
    }
    return item ? item.toString() : '';
  }

  //#region ControlValueAccessor Overrides
  /**
   * Allows Angular to update the model, Update the model and changes needed for the view here
   * @param obj 
   */
  writeValue(obj: any): void {
    this.selectedValue = obj;
    this.onChange(this.selectedValue)
  }
  /**
   * Allows Angular to register a function to call when the model changes, 
   * Save the function as a property to call later here.
   * @param fn 
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  /**
   * Allows Angular to register a function to call when the input has been touched.
   * Save the function as a property to call later here
   * @param fn 
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  /**
   * Allows Angular to disable the input.
   * @param isDisabled 
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisable = isDisabled;
    this.renderer.setProperty(this.input.nativeElement, 'disabled', isDisabled);
    this.renderer.setProperty(this.btn.nativeElement, 'disabled', isDisabled);
  }
  //#endregion

  //#region Event Handlers
  toggleDropDown() {
    if (!this.isDisable) {
      this.isDropListVisible = !this.isDropListVisible;
    }
  }
  onSelect(item: any) {
    this.writeValue(item);
    this.isDropListVisible = false;
  }
  @HostListener('document:keyup', ['$event'])
  keyEvent(evt: KeyboardEvent) {
    if (evt.keyCode === 27) { // Escape key
      this.isDropListVisible = false;
    }
    console.log(evt.keyCode);
    if (this.hasFocus) {
      switch (evt.keyCode) {
        case 40: { // Down Arrow key
          this.isDropListVisible = true;
          break;
        };
        case 38: { // Up Arrow Key

          break;
        };

      }
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(evt: MouseEvent) {
    let node = evt.target['parentNode'];
    while (node) {
      if (node.className && node.className.indexOf('avam-dd') >= 0) {
        return;
      }
      node = node['parentNode'];
    }
    this.hasFocus = this.isDropListVisible = false;
  }
  onFocus(evt: FocusEvent) {
    console.log(evt);

    this.hasFocus = true;
  }
  onBlur(evt: FocusEvent) {
    this.ddMenu = this.elRef.nativeElement.querySelector('#ddMenu');
    if (!this.ddMenu) {
      this.hasFocus = this.isDropListVisible = false;
    } else {
      this.ddMenu.addEventListener('blur', (evt) => {
        console.log(evt);
      })
    }
  }
  onInputClick() {
    if(!this.isSearchable) {
      this.toggleDropDown();
    }
  }
  getSelectedClass(item: any): any {
    // debugger;
    return {
      selected: item === this.selectedValue
    };
  }
  getDropDownDirectionClass(): any {
    return {
      'pos-bottom': this.dropDirection === 'BOTTOM',
      'pos-top': this.dropDirection === 'TOP'
    };
  }
  //#endregion

}
