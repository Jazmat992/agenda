import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DataService {
  private apiUrl = '/api/data/';

  constructor(private http: HttpClient) {}

  getData(endPoint: String): Observable<any> {
    return this.http.get<any>(this.apiUrl + endPoint);
  }

  saveData(endPoint: String, data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + endPoint, data);
  }

  patchData(endPoint: String, data: any): Observable<any> {
    return this.http.patch<any>(this.apiUrl + endPoint, data);
  }

  deleteData(endPoint: String): Observable<any> {
    return this.http.delete<any>(this.apiUrl + endPoint);
  }
}
