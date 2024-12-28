import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:8080/student';

  constructor(private http: HttpClient) { }

  getStudentProfile(studentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/id/${studentId}`);
  }

  getExamResults(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/results/${studentId}`);
  }

  getFees(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/fees/${studentId}`);
  }
}

