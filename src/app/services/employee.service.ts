import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/employee';
  private crudUrl = 'http://localhost:8080/admin/e';

  constructor(private http: HttpClient) { }

  // Fetch employee profile by ID
  getEmployeeProfile(employeeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/id/${employeeId}`);
  }

  // Create a new employee
  createEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.crudUrl}/create`, employee);
  }

  // Update an employee's data
  updateEmployee(id: number, updatedEmployee: any): Observable<any> {
    return this.http.put(`${this.crudUrl}/update/${id}`, updatedEmployee);
  }

  // Delete an employee by ID
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.crudUrl}/delete/${id}`);
  }

  // Fetch all employees (for Admin)
  getAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.crudUrl}/all`);
  }

  // Fetch employee by name (for Admin)
  getEmployeeByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.crudUrl}/name/${name}`);
  }

  // Fetch employee by username (for Admin)
  getEmployeeByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.crudUrl}/username/${username}`);
  }
}

export interface Employee {
  id: number;
  name: string;
  subject: string;
  classesTaught: string[];
  user: User;
}

export interface User {
  username: string;
  password: string;
  role: string;
}