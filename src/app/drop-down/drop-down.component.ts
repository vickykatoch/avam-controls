import {
  Component,
  forwardRef,
  Input,
  Output,
  HostBinding,
  Renderer2,
  ViewChild,
  ElementRef,
  EventEmitter,
  HostListener
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { fromEvent } from "rxjs/observable/fromEvent";
import { merge } from "rxjs/observable/merge";
import { debounceTime } from 'rxjs/operators/debounceTime';
import { Subscription } from "rxjs/Subscription";

const DROPDOWN_DIRECTION_TOP = "TOP";
const DROPDOWN_DIRECTION_BOTTOM = "BOTOM";

@Component({
  selector: "avam-drop-down",
  templateUrl: "./drop-down.component.html",
  styleUrls: ["./drop-down.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownComponent),
      multi: true
    }
  ]
})
export class DropDownComponent implements ControlValueAccessor {
  //#region External Input/Output
  @Input() selectedValue: any;
  @Input() displayField: string;
  @Input() set listItems(items: any[]) {
    this.items = items;
    this.viewList = items;
  }
  @ViewChild("input") input: ElementRef;
  @ViewChild("btn") btn: ElementRef;
  @ViewChild("dummyNode") dummyNode: ElementRef;
  @Input() visibleItemsCount = 8;
  @Input() dropDirection: string = DROPDOWN_DIRECTION_BOTTOM;
  @Output() selectionChanged = new EventEmitter<any>();
  @Input()
  set disabled(value: boolean) {
    this.setDisabledState(value);
  }
  @Input()
  set isSearchable(value: boolean) {
    if (value) {
      this.renderer.removeAttribute(this.input.nativeElement, "readonly");
    } else {
      this.renderer.setAttribute(this.input.nativeElement, "readonly", "true");
    }
    this._isSearchable = value;
  }
  @Input()
  set showDropDownButton(value: boolean) {
    this.renderer.setStyle(
      this.btn.nativeElement,
      "display",
      value ? "" : "none"
    );
  }
  //#endregion

  //#region Internal State
  private ddMenu: HTMLUListElement;
  private _isSearchable = false;
  private ddContainerHeight = 0;
  private itemHeight = 0;
  isDropListVisible = false;
  hasFocus = false;
  private isDisabled = false;
  private items: any[];
  viewList = this.items;
  private subscriptions: Subscription[] = [];
  onChange = (rating: number) => { };
  onTouched = () => { };
  //#endregion

  //#region ctor
  constructor(private renderer: Renderer2, private elRef: ElementRef) { }
  //#endregion

  //#region NG Lifecycle Hooks
  ngOnInit() {
    !this._isSearchable &&
      this.renderer.setAttribute(this.input.nativeElement, "readonly", "");
    this.subscriptions.push(
      merge(
        fromEvent(this.input.nativeElement, "focus"),
        fromEvent(this.btn.nativeElement, "focus")
      ).subscribe(this.onFocus.bind(this))
    );
    this.subscriptions.push(
      merge(
        fromEvent(this.input.nativeElement, "blur"),
        fromEvent(this.btn.nativeElement, "blur")
      ).subscribe(this.onBlur.bind(this))
    );
    this.subscriptions.push(
      fromEvent(this.input.nativeElement, "click").subscribe(
        this.onInputClick.bind(this)
      )
    );
    this.subscriptions.push(
      fromEvent(this.input.nativeElement, "keyup").pipe(debounceTime(250)).subscribe(this.onSearch.bind(this))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
  //#endregion

  //#region Hostbindings & HostListeners
  @HostBinding("style.opacity")
  get opacity() {
    return this.disabled ? 0.25 : 1;
  }
  @HostListener("document:keyup", ["$event"])
  keyEvent(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      // Escape key
      this.isDropListVisible = false;
    }
    if (this.hasFocus) {
      switch (evt.keyCode) {
        case 40: {
          // Down Arrow key
          this.moveDown();
          break;
        }
        case 38: {
          // Up Arrow Key
          this.moveUp();
          break;
        }
      }
    }
  }
  @HostListener("document:click", ["$event"])
  onDocumentClick(evt: MouseEvent) {
    let node = evt.target["parentNode"];
    while (node) {
      if (node.className && node.className.indexOf("avam-dd") >= 0) {
        return;
      }
      node = node["parentNode"];
    }
    this.hasFocus = this.isDropListVisible = false;
  }
  //#endregion

  //#region Control's Gui Callbacks
  get value(): string {
    return this.getDisplayValueForItem(this.selectedValue);
  }
  onSelect(item: any, hide?: boolean) {
    this.writeValue(item);
    if (hide) {
      this.isDropListVisible = false;
    } else {
      this.bringItemIntoView();
    }
  }
  toggleDropDown(forceShow?: boolean) {
    if (!this.isDisabled) {
      if(forceShow) {
        if(!this.isDropListVisible) {
          this.isDropListVisible = true;
          this.adjustVisibleHeight();
        }
      } else {
        this.isDropListVisible = !this.isDropListVisible;
        this.adjustVisibleHeight();
      }
    }
  }
  getSelectedClass(item: any): any {
    return {
      selected: item === this.selectedValue
    };
  }
  getDropDownDirectionClass(): any {
    return {
      "pos-bottom": this.dropDirection === "BOTTOM",
      "pos-top": this.dropDirection === "TOP"
    };
  }

  //#endregion

  //#region ControlValueAccessor Overrides
  /**
   * Allows Angular to update the model, Update the model and changes needed for the view here
   * @param obj
   */
  writeValue(obj: any): void {
    if (obj !== this.selectedValue) {
      this.selectedValue = obj;
      this.onChange(this.selectedValue);
      this.selectionChanged.next(obj);
    }
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
    this.renderer.setProperty(this.input.nativeElement, "disabled", isDisabled);
    this.renderer.setProperty(this.btn.nativeElement, "disabled", isDisabled);
    this.isDisabled = isDisabled;
  }
  //#endregion

  //#region Helper Methods
  private moveDown() {
    if (this.viewList.length > 0) {
      const currentIndex = this.selectedValue
        ? this.viewList.findIndex(x => x === this.selectedValue)
        : -1;
      if (currentIndex < this.viewList.length - 1) {
        const item = this.viewList[currentIndex + 1];
        this.onSelect(item);
        this.input.nativeElement.select();
      }
    }
  }
  private moveUp() {
    if (this.viewList.length > 0 && this.selectedValue) {
      const currentIndex = this.viewList.findIndex(
        x => x === this.selectedValue
      );
      const index = currentIndex > 0 ? currentIndex - 1 : 0;
      const item = this.viewList[index];
      this.onSelect(item);
    }
  }
  private adjustVisibleHeight() {
    if (
      this.isDropListVisible &&
      this.viewList.length > 0 &&
      this.viewList.length > this.visibleItemsCount
    ) {
      setTimeout(() => {
        this.ddMenu = this.elRef.nativeElement.querySelector("#ddMenu");
        if (this.ddMenu) {
          this.itemHeight = this.ddMenu.children[0].clientHeight;
          this.ddContainerHeight = this.itemHeight * this.visibleItemsCount;
          this.ddMenu.style.height = `${this.ddContainerHeight}px`;
        }
      }, 0);
    }
  }
  private getDisplayValueForItem(item: any): string {
    if (item === undefined || item === null) {
      return "";
    } else {
      if (this.displayField) {
        if (typeof item === "object") {
          return item[this.displayField];
        } else {
          return item;
        }
      }
      return item ? item.toString() : "";
    }
  }
  private bringItemIntoView() {
    if (this.ddMenu) {
      const currentIndex = this.viewList.findIndex(
        x => x === this.selectedValue
      );
      this.ddMenu.children[currentIndex].scrollIntoView();
    }
  }
  private onFocus(evt: FocusEvent) {
    this.viewList = this.items;
    this.hasFocus = true;
  }
  private onBlur(evt: FocusEvent) {
    this.ddMenu = this.elRef.nativeElement.querySelector("#ddMenu");
    if (this.ddMenu) {
      setTimeout(() => {
        this.hasFocus = this.isDropListVisible = false;
      }, 500);
    }
  }
  private onInputClick() {
    if (!this._isSearchable) {
      this.toggleDropDown();
    }
  }
  onSearch(evt: KeyboardEvent) {
    console.log(evt.keyCode);
    const shouldSearch = (evt.keyCode >= 65 && evt.keyCode <= 90) || (evt.keyCode >= 48 && evt.keyCode <= 57);
    if (shouldSearch) {
      const str: string = evt.target['value'].toLowerCase().trim();
      if (str) {
        if (this.displayField) {
          this.viewList = this.items.filter(x => {
            const value = x[this.displayField].toString().toLowerCase();
            return value.startsWith(str);
          });
        } else {
          this.viewList = this.items.filter(x => x.toString().toLowerCase().startsWith(str));
        }
      } else {
        this.viewList = this.items;
      }
      if (this.viewList.length > 0) {
        this.toggleDropDown(true);
      }
    }
  }
  //#endregion
}
