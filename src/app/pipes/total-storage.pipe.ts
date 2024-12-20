import { Pipe, PipeTransform } from '@angular/core';
import { FileList } from '../pages/bucket-edit/bucket-edit.component';

@Pipe({
  name: 'totalStorage'
})
export class TotalStoragePipe implements PipeTransform {

  transform(fieList: FileList[], ): number {
    if (!fieList) return 0 ;
    return fieList.reduce((total, file) => {
      return total += file.size;
    },0);
  }
}
