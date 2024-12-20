import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TableDataPipePipe } from '../../pipes/table-data-pipe.pipe';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

export enum HeaderConfiguationTypes {
  NUMBER,
  DATE,
  FILESIZE,
  STRING
}

export interface HeaderConfiguration {
  [key: string]: {
    type: HeaderConfiguationTypes;
    width?: number,
    title: string;
  }
}

@Component({
  selector: 'app-custom-table',
  imports: [TableDataPipePipe, NgbPagination],
  standalone: true,
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.css'
})
export class CustomTableComponent implements OnInit, OnChanges{
  @Input() headerConfiguration!: HeaderConfiguration;
  @Input() dataList: any[] = [];
  @Output() clickedRow: EventEmitter<number> = new EventEmitter<number>();
  
  paginatedData: any[] = []
  currentPage: number = 1;
  headerKeys!: string[];
  itemsPerPage: number = 5;
  constructor() {
    
  }
  ngOnInit(): void {
    this.headerKeys = Object.keys(this.headerConfiguration);
    this.updatePaginatedData();
  }

  onRowClick(index: number): void {
    this.clickedRow.emit(index);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataList'] && ! changes['dataList'].firstChange) {
      this.updatePaginatedData();
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.dataList.slice(startIndex, endIndex);
  }
}
