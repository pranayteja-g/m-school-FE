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

  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.curdUrl}/all`);
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

export interface Student{
  id: number;
  name: string;
  studentClass: string;
  section: string;
  rollNo: string;
  user: User;
}

export interface User {
  username: string;
  password: string;
  role: string;
}