import { Pipe, PipeTransform } from '@angular/core';
import { HeaderConfiguationTypes } from '../components/custom-table/custom-table.component';

@Pipe({
  name: 'tableDataPipe'
})
export class TableDataPipePipe implements PipeTransform {

  transform(value: any, type: HeaderConfiguationTypes): any {
    switch (type) {
      case HeaderConfiguationTypes.FILESIZE:
        if (value == 0) {
          return '0 Bytes';
        }
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const unitIndex = Math.floor(Math.log(value) / Math.log(1024));
        const formattedSize = Math.round(value / Math.pow(1024, unitIndex));
        return `${formattedSize} ${units[unitIndex]}`;
      case HeaderConfiguationTypes.DATE:
        const [year, month, day] = new Date(value).toISOString().split('T')[0].split('-');
        return `${day}.${month}.${year}`;
    }
    return value;
  }

}
