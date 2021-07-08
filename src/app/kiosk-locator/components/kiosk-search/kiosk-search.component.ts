import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IonInput } from "@ionic/angular";

@Component({
  selector: "app-kiosk-search",
  templateUrl: "./kiosk-search.component.html",
  styleUrls: ["./kiosk-search.component.scss"],
})
export class KioskSearchComponent implements OnInit {
  displaySearchIcon: boolean;
  @ViewChild("searchInput") input: IonInput;
  @Input() searchInput: string;
  @Output() back = new EventEmitter();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.focusInput();
  }

  onInputChange($event) {}

  initForm() {
    this.form = this.formBuilder.group({
      keyword: [this.searchInput],
    });
  }

  focusInput() {
    setTimeout(() => {
      this.input.setFocus();
    }, 50);
  }

  goBack(selectedKiosk?: any) {
    this.back.emit(selectedKiosk);
  }

  onClear() {}
}
