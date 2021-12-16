import { animate, style, transition, trigger } from '@angular/animations';
import { EventEmitter, Input, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, Output, SimpleChange } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataListService } from './sp-datalist.service';
// import { DataListService } from '../public-api';

@Component({
  selector: 'dl-lib',
  templateUrl: './sp-datalist.component.html',
  styleUrls: ['./sp-datalist.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(':enter', [

          // css styles at start of transition
          style({ opacity: 0 }),

          // animation and styles at end of transition
          animate('.3s', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          // css styles at start of transition
          style({ opacity: 1 }),

          // animation and styles at end of transition
          animate('.3s', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class DataListComponent implements OnInit {

  @Input() data: any = {
    role: null,
    stage: null,
    category: null
  };
  @Input() ids: []
  @Output() rData = new EventEmitter<any>();


  private customerDiffer: KeyValueDiffer<string, any>;

  recomendedDocs = [];
  selectedArray = [];
  selectedData = [];
  form: FormGroup;
  isVisible = false;


  constructor(private listServices: DataListService, private fb: FormBuilder, private differs: KeyValueDiffers, private spinner: NgxSpinnerService) {
    this.form = this.fb.group({
      docsArray: this.fb.array([], [Validators.required])
    });
    if (this.data) {
      this.customerDiffer = this.differs.find(this.data).create();
    }
  }

  ngOnInit() {
  }
  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    // Extract changes to the input property by its name
    for (const propName in changes) {
      const changedProp = changes[propName];
      if (this.listServices.hasNull(changedProp.currentValue) && propName == 'ids') {
        this.spinner.show()
        this.loadComponent(changedProp.currentValue)
      } else {
        this.resetData();
      }
    }


  }

  restartData() {
    this.rData.emit({
      role: null,
      stage: null,
      category: null
    });
  }

  resetData() {
    this.selectedArray = [];
    this.recomendedDocs = [];
    this.isVisible = false;
  }

  onBack(ev) {
    this.isVisible = false;
    this.form = this.fb.group({
      docsArray: this.fb.array([], [Validators.required])
    });
    this.selectedArray = [];
    this.selectedData = [];
  }

  loadComponent(params: any) {
    this.isVisible = false;
    this.recomendedDocs = []
    this.listServices.getRSC(params).subscribe(
      res => {
        this.spinner.hide();
        this.recomendedDocs = res;
        // console.log('res', this.recomendedDocs)
      },
      error => {
        this.spinner.hide();
        console.error(error)
      }
    )
  }


  validateFilterData() {
    return (this.data.role && this.data.stage && this.data.category) && !this.isVisible;
  }

  onCheckboxChange(e) {
    const docsArray: FormArray = this.form.get('docsArray') as FormArray;

    if (e.target.checked) {
      docsArray.push(new FormControl(e.target.value));
      this.selectedData.push(this.recomendedDocs.find(doc => e.target.value == doc.id))
    } else {
      let i: number = 0;
      docsArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          docsArray.removeAt(i);
          this.selectedData.splice(i, 1);
          return;
        }
        i++;
      });
    }
  }

  submitForm() {
    this.selectedArray = this.form.value['docsArray'];
    this.isVisible = true;
  }

  isYoutube(url) {
    let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? '1' : '0';
  }

}