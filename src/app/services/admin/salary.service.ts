import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private baseUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  createSalary(salary: CreateSalaryDto) {
    return this.http.post<Salary>(`${this.baseUrl}/sal/create`, salary);
  }

  getAllSalaries() {
    return this.http.get<Salary[]>(`${this.baseUrl}/sal/all`);
  }

  getSalariesBetween(startDate: string, endDate: string) {
    return this.http.get<Salary[]>(`http://localhost:8080/employee/salary/between`, {
      params: { startDate, endDate },
    });
  }

  getSalaryByEmployeeId(employeeId: number) {
    return this.http.get<Salary[]>(`http://localhost:8080/employee/salary/${employeeId}`);
  }

  updateSalary(id: number, salary: CreateSalaryDto) {
    return this.http.put<Salary>(`${this.baseUrl}/sal/update/${id}`, salary);
  }

  deleteSalary(salaryId: number) {
    return this.http.delete<void>(`${this.baseUrl}/sal/delete/${salaryId}`);
  }
}
export interface EmployeeDto {
  id: number;
  name?: string;
  subject?: string;
}

export interface Salary {
  id: number;
  salaryAmount: number;
  createdDate: Date;
  employee: {
    id: number;
  };
  employeeDto?: EmployeeDto;
}

// For creating a new salary, we don't need all fields
export interface CreateSalaryDto {
  salaryAmount: number;
  employee: {
    id: number;
  };
}