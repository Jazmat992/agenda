import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(bytes: number): string {
    if (bytes == 0) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const formattedSize = Math.round(bytes / Math.pow(1024, unitIndex));
    return `${formattedSize} ${units[unitIndex]}`;
  }

}
