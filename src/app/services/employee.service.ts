import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/employee';

  constructor(private http: HttpClient) { }

  getEmployeeProfile(employeeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/id/${employeeId}`);
  }
}