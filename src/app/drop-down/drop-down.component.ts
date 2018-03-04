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
import { debounceTime } from "rxjs/operators/debounceTime";
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
  @Input() listItems: any[];
  @ViewChild("input") input: ElementRef;
  @ViewChild("btn") btn: ElementRef;
  @Input() visibleItemsCount = 8;
  @Input() dropDirection: string = DROPDOWN_DIRECTION_BOTTOM;
  @Output() selectionChanged = new EventEmitter<any>();
  @Input()
  set disabled(value: boolean) {
    this.setDisabledState(value);
  }
  //#endregion

  //#region Internal State
  private dropLayer: HTMLUListElement;
  private ddContainerHeight = 0;
  private itemHeight = 0;
  isDropListVisible = false;
  _hasFocus = false;
  private isSearching = false;
  private isDisabled = false;
  private subscriptions: Subscription[] = [];
  onChange = (rating: number) => {};
  onTouched = () => {};
  //#endregion

  //#region ctor
  constructor(private renderer: Renderer2, private elRef: ElementRef) {}
  //#endregion

  //#region NG Lifecycle Hooks
  ngOnInit() {
    this.subscriptions.push(
      fromEvent(this.input.nativeElement, "focus").subscribe(
        this.onFocus.bind(this)
      )
    );
    this.subscriptions.push(
      fromEvent(this.input.nativeElement, "blur").subscribe(
        this.onBlur.bind(this)
      )
    );
    this.subscriptions.push(
      fromEvent(this.input.nativeElement, "keyup").subscribe(
        this.onKeyInput.bind(this)
      )
    );
    this.subscriptions.push(
      fromEvent(this.input.nativeElement, "click").subscribe(
        this.onInputClick.bind(this)
      )
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
  //#endregion

  //#region Hostbindings & HostListeners
  @HostBinding("class.input-focus")
  get isInputFocus() {
    return this.hasFocus;
  }
  // @HostBinding("style.opacity")
  // get opacity() {
  //   return this.disabled ? 0.25 : 1;
  // }
  @HostListener("document:keyup", ["$event"])
  keyEvent(evt: KeyboardEvent) {
    if (evt.keyCode === 27) {
      // Escape key
      this.isDropListVisible = this.isSearching = false;
    }
  }
  @HostListener("document:click", ["$event"])
  onDocumentClick(evt: MouseEvent) {
    //TODO:
    let node = evt.target["parentNode"];
    while (node) {
      if (node.className && node.className.indexOf("avam-dropdown") >= 0) {
        return;
      }
      node = node["parentNode"];
    }
    this.isDropListVisible = false;
  }
  //#endregion

  //#region Control's Gui Callbacksi
  get hasFocus(): boolean {
    return this._hasFocus;
  }
  onSelect(item: any, hide?: boolean) {
    if (item !== this.selectedValue) {
      this.writeValue(item);
      this.onChange(this.selectedValue);
      if (hide) {
        this.isDropListVisible = false;
      } else {
        this.bringItemIntoView();
      }
      this.input.nativeElement.focus();
    }
  }
  toggleDropDownVisibility(show: boolean) {
    if (show) {
      this.isDropListVisible = true;
      this.adjustVisibleHeight();
    } else {
      this.isDropListVisible = false;
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
      this.renderer.setProperty(
        this.input.nativeElement,
        "value",
        this.getDisplayValueForItem(obj)
      );
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
    debugger;
    this.renderer.setProperty(this.input.nativeElement, "disabled", isDisabled);
    this.renderer.setProperty(this.btn.nativeElement, "disabled", isDisabled);
    this.isDisabled = isDisabled;
  }
  //#endregion

  //#region Helper Methods
  private moveDown() {
    if (this.listItems && this.listItems.length > 0) {
      const currentIndex = this.selectedValue
        ? this.listItems.findIndex(x => x === this.selectedValue)
        : -1;
      if (currentIndex < this.listItems.length - 1) {
        const item = this.listItems[currentIndex + 1];
        this.onSelect(item);
      }
    }
  }
  private moveUp() {
    if (this.listItems && this.listItems.length > 0 && this.selectedValue) {
      const currentIndex = this.listItems.findIndex(
        x => x === this.selectedValue
      );
      const index = currentIndex > 0 ? currentIndex - 1 : 0;
      const item = this.listItems[index];
      this.onSelect(item);
    }
  }
  private onKeyInput(evt: KeyboardEvent) {
    switch (evt.keyCode) {
      case 27: {
        this.isDropListVisible = this.isSearching = false;
        break;
      }
      case 40: {
        // Down arrow key
        this.isSearching = false;
        this.moveDown();
        break;
      }
      case 38: {
        // Up Arrow Key
        this.isSearching = false;
        this.moveUp();
        break;
      }
      case 13: {
        this.isDropListVisible = this.isSearching = false;
        break;
      }
      default:
        this.isSearching = true;
        this.onSearch(evt.key);
    }
  }
  private adjustVisibleHeight() {
    if (
      this.isDropListVisible &&
      this.listItems &&
      this.listItems.length > this.visibleItemsCount
    ) {
      setTimeout(() => {
        this.dropLayer = this.elRef.nativeElement.querySelector("#drop-layer");
        if (
          this.dropLayer &&
          this.dropLayer.children &&
          this.dropLayer.children.length > 0
        ) {
          this.itemHeight = this.dropLayer.children[0].clientHeight;
          this.ddContainerHeight = this.itemHeight * this.visibleItemsCount;
          this.dropLayer.style.height = `${this.ddContainerHeight}px`;
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
    if (this.dropLayer) {
      const currentIndex = this.listItems.findIndex(
        x => x === this.selectedValue
      );
      if (currentIndex >= 0) {
        this.dropLayer.children[currentIndex].scrollIntoView();
      }
    }
  }
  private onFocus(evt: FocusEvent) {
    this._hasFocus = true;
  }
  private onBlur(evt: FocusEvent) {
    this._hasFocus = false;
    this.dropLayer = this.elRef.nativeElement.querySelector("#drop-layer");
    if (this.dropLayer) {
      setTimeout(() => {
        this.isDropListVisible = false;
      }, 150);
    }
  }
  private onInputClick() {
    this.toggleDropDownVisibility(true);
  }
  private onSearch(str: string) {
    if (str && str.length > 0) {
      str = str.toLowerCase();
      let selectedIndex = -1;
      if (this.displayField) {
        selectedIndex = this.listItems.findIndex(item => {
          const value = item[this.displayField];
          return value && value.toLowerCase().startsWith(str);
        });
      } else {
        selectedIndex = this.listItems.findIndex(item =>
          item.toLowerCase().startsWith(str)
        );
      }
      if (selectedIndex >= 0) {
        this.onSelect(this.listItems[selectedIndex]);
      }
    }
    // if (this.isSearching) {
    // let str: string = this.input.nativeElement.value;
    // if (str && str.length > 0) {
    //   str = str.toLowerCase();
    //   if (this.displayField) {
    //     this.listItems = this.items.filter(x => {
    //       const value = x[this.displayField].toString().toLowerCase();
    //       return value.startsWith(str);
    //     });
    //   } else {
    //     this.listItems = this.items.filter(x =>
    //       x
    //         .toString()
    //         .toLowerCase()
    //         .startsWith(str)
    //     );
    //   }
    // } else {
    //   this.listItems = this.items;
    // }
    // this.listItems.length > 0 && this.toggleDropDown(true);
    // }
  }
  //#endregion
}
