import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FeeService {
  private baseUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  createFee(fee: Omit<FeeRequest, 'id'>): Observable<FeeResponse> {
    return this.http.post<FeeResponse>(`${this.baseUrl}/f/create`, fee);
  }

  getAllFees(): Observable<FeeResponse[]> {
    return this.http.get<FeeResponse[]>(`${this.baseUrl}/f/all`);
  }

  getStudentFees(studentId: number) {
    return this.http.get<FeeResponse[]>(`http://localhost:8080/student/fees/${studentId}`);
  }

  updateFee(fee: FeeRequest): Observable<FeeResponse[]> {
    return this.http.put<FeeResponse[]>(`${this.baseUrl}/f/update/${fee.id}`, fee);
  }

  deleteFee(feeId: number) {
    return this.http.delete<FeeResponse[]>(`${this.baseUrl}/f/delete/${feeId}`);
  }



}

export interface FeeResponse {
  id: number;
  studentDto: {
    id: number;
    name: string;
  };
  feeType: string;
  paidAmount: number;
  totalAmount: number;
  dueAmount: number;
}

export interface FeeRequest {
  id?: number;
  student: {
    id: number;
  };
  feeType: string;
  paidAmount: number;
  totalAmount: number;
  dueAmount: number;
}
