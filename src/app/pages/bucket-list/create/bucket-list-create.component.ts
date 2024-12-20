import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormControl, } from "@angular/forms"
import { DataService } from '../../../services/data.service';
import { APIFunctions } from '../../../constants/api-functions';
import { CustomModalData, CustomModalComponent } from '../../../components/custom-modal/custom-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

@Component({
	selector: 'app-bucket-list-create',
	imports: [ReactiveFormsModule, NgSelectModule],
	templateUrl: './bucket-list-create.component.html',
	styleUrl: './bucket-list-create.component.css'
})
export class BucketListCreateComponent implements OnInit {
	form: FormGroup;
  @Output() hideCreate: EventEmitter<boolean> = new EventEmitter<boolean>();
  locations: string[] = [];
  @Output() newBucket: EventEmitter<any> = new EventEmitter<any>();
  
	constructor(
    private dataService: DataService,
    private modalService: NgbModal
  ) {
		this.form = new FormGroup({
			name: new FormControl('', [Validators.required]),
			location: new FormControl(null, [Validators.required])
		});
	}

	ngOnInit(): void {
    this.dataService.getData(APIFunctions.LOCATIONS).subscribe((res) => {
      this.locations = res;
    });
	}
	submitForm(): void {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    if (this.form.valid) {
      this.dataService.saveData(APIFunctions.BUCKETS, this.form.value).subscribe((data) => {
        if (data.success) {
          this.newBucket.emit(this.form.value);
          this.hide();
        } else {
          const ref = this.modalService.open(CustomModalComponent, {
              centered: true,
              backdrop: 'static'
            });
            const modalData: CustomModalData = {
              title: 'Error',
              body: 'Object not uploaded!'
            };
            ref.componentInstance.modalData = modalData;
        }
      });
    }
	}

  hide(): void {
    this.form.reset();
    this.hideCreate.emit(false);
  }
}
