import { Component, OnInit } from '@angular/core';
import { BucketListCreateComponent } from "./create/bucket-list-create.component";
import { DataService } from '../../services/data.service';
import { APIFunctions } from '../../constants/api-functions';
import { Router } from '@angular/router';
import { HeaderConfiguration, HeaderConfiguationTypes } from '../../components/custom-table/custom-table.component';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

export interface BucketList {
  name: string,
  location: string
}

@Component({
  selector: 'app-bucket-list',
  imports: [BucketListCreateComponent, CustomTableComponent, LoadingSpinnerComponent],
  templateUrl: './bucket-list.component.html',
  styleUrl: './bucket-list.component.css',
  standalone: true
})
export class BucketListComponent implements OnInit {
  bucketList!: BucketList[];
  createNew: boolean = false;
  headerConfiguration: HeaderConfiguration = {
    'name': {
      title: 'Name',
      type: HeaderConfiguationTypes.STRING,
      width: 66
    },
    'location': {
      title: 'Location',
      type: HeaderConfiguationTypes.STRING
    }
  }
  constructor(
    private dataService: DataService,
    private router: Router) {

  }
  ngOnInit(): void {
    this.dataService.getData(APIFunctions.BUCKETS).subscribe((res) => {
      if (res.error) this.bucketList = [];
      else this.bucketList = res;
    });
  }

  showCreate(): void {
    this.createNew = true;
  }
  onHideCreate(hide: boolean): void {
    this.createNew = hide;
  }
  onRowClick(index: number): void {
    this.router.navigate([`/bucket-edit/${index}`]);
  }

  addNewBucket(bucket: BucketList){
    this.bucketList = this.bucketList.concat([bucket]);
  } 
}
