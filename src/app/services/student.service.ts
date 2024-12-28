import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:8080/student';

  private curdUrl = 'http://localhost:8080/admin/s';

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

  getStudentsByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/name/${name}`);
  }

  createStudent(student: any): Observable<any> {
    return this.http.post(`${this.curdUrl}/create`, student);
  }

  updateStudent(studentId: number, student: any): Observable<any> {
    return this.http.put(`${this.curdUrl}/update/${studentId}`, student);
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete(`${this.curdUrl}/delete/${studentId}`);
  }
}

