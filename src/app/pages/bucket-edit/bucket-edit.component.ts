import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { APIFunctions } from '../../constants/api-functions';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { CustomModalComponent } from '../../components/custom-modal/custom-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomModalData } from '../../components/custom-modal/custom-modal.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TotalStoragePipe } from '../../pipes/total-storage.pipe';
import { CommonModule } from '@angular/common';
import { CustomTableComponent, HeaderConfiguration, HeaderConfiguationTypes } from '../../components/custom-table/custom-table.component';


export interface FileList {
  name: string,
  modified: number,
  size: number
  selected?: boolean
}

interface BucketInfo {
  name: string,
  location: string,
  size: number,
  files: FileList[]
}

@Component({
  selector: 'app-bucket-edit',
  imports: [LoadingSpinnerComponent, FileSizePipe, NgbNavModule, TotalStoragePipe, CommonModule, CustomTableComponent],
  templateUrl: './bucket-edit.component.html',
  styleUrl: './bucket-edit.component.css'
})
export class BucketEditComponent implements OnInit {
  bucketInfo!: BucketInfo;
  bucketId!: string | null;
  headerConfiguration: HeaderConfiguration = {
    name: {
      title: 'Name',
      type: HeaderConfiguationTypes.STRING,
      width: 50
    },
    modified: {
      title: 'Last modified',
      type: HeaderConfiguationTypes.DATE
    },
    size: {
      title: 'Size',
      type: HeaderConfiguationTypes.FILESIZE
    }
  };
  constructor(
    private datasService: DataService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.bucketId = this.route.snapshot.paramMap.get('id');
    this.datasService.getData(APIFunctions.BUCKET_DETAIL + `/${this.bucketId}`).subscribe((res: BucketInfo) => {
      this.bucketInfo = res;
      if (!this.bucketInfo) this.router.navigate(['']);
    });
  }

  fileUpload(event: any): void {
    if (!event.target.files.length) return;
    const result: FileList[] = [];
    for (const file of event.target.files) {
      result.push({
        name: file.name,
        modified: file.lastModified,
        size: file.size
      });
    }

    
    const id = this.bucketId ? parseInt(this.bucketId) : -1;
    if (id != -1) {
      this.datasService.patchData(APIFunctions.BUCKETS, {id: id, addFiles: result}).subscribe((res) => {
        if (res.success) {
          this.bucketInfo.files = this.bucketInfo.files.concat(result);
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
    event.target.value = null;
  }
  toggleRowSelection(index: any): void {
    this.bucketInfo.files[index].selected = !this.bucketInfo.files[index].selected;
  }

  fileDelete(): void {
    if (this.bucketInfo.files.some(file => file.selected === true)) {
      const id = this.bucketId ? parseInt(this.bucketId) : -1;
      if (id == -1) return;
      
      const ref = this.modalService.open(CustomModalComponent, {
        centered: true,
        backdrop: 'static'
      });
      const modalData: CustomModalData = {
        title: 'Delete objects',
        body: 'Are you sure you want to delete selected objects?',
        showSubmit: true,
        submitText: 'Delete'
      }
      ref.componentInstance.modalData = modalData;
      
      ref.result.then((result) => {
        if (!result) return;
        const filesRemove: number[] = [];
        this.bucketInfo.files.map((file, index) => {
          if (file.selected) filesRemove.push(index);
        });

        this.datasService.patchData(APIFunctions.BUCKETS, {id: id, removeFiles: filesRemove}).subscribe((res) => {
          if (res.success) {
            this.bucketInfo.files = this.bucketInfo.files.filter((file,index) => !filesRemove.includes(index));
          } else {
            const ref = this.modalService.open(CustomModalComponent, {
              centered: true,
              backdrop: 'static'
            });
            const modalData: CustomModalData = {
              title: 'Error',
              body: 'Object not deleted!'
            };
            ref.componentInstance.modalData = modalData;
          }
        });
      });
    } else {
      const ref = this.modalService.open(CustomModalComponent, {
        centered: true,
        backdrop: 'static'
      });
      const modalData: CustomModalData = {
        title: 'Error',
        body: 'No object selected!'
      };
      ref.componentInstance.modalData = modalData;
    }
  }
  deleteBucket(): void {
    const ref = this.modalService.open(CustomModalComponent, {
      centered: true,
      backdrop: 'static'
    });
    const modalData: CustomModalData = {
      title: 'Delete Bucket',
      body: 'Are you sure you want to delete this bucket?',
      showSubmit: true,
      submitText: 'Delete'
    };
    ref.componentInstance.modalData = modalData;

    ref.result.then((result) => {
      if (!result) return;


      this.datasService.deleteData(APIFunctions.BUCKETS + `/${this.bucketId}`).subscribe((res) => {
        if (res.success) {
          this.router.navigate(['']);
        } else {
          const modalData: CustomModalData = {
            title: 'Error',
            body: 'Error deleting bucket!'
          };
          ref.componentInstance.modalData = modalData;
        }
      });
    });
  }
}
