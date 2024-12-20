import { AfterContentInit, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface CustomModalData {
  title: string,
  body: string
  showSubmit?: boolean;
  submitText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-custom-modal',
  imports: [],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.css'
})
export class CustomModalComponent implements AfterContentInit {

  @Input() modalData!: CustomModalData; 

  constructor(
    public activeModal: NgbActiveModal
  ) {
  }
  onSubmit(): void {
    this.activeModal.close(true);
  }
  ngAfterContentInit(): void {
    if (!this.modalData.cancelText) this.modalData.cancelText = 'Cancel';
  }
}
