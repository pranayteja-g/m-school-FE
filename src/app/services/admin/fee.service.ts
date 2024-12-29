import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FeeService {
  private baseUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  createFee(fee: Omit<Fee, 'id'>): Observable<Fee> {
    // Remove the id field when creating a new fee
    const { id, ...feeWithoutId } = fee as Fee;
    return this.http.post<Fee>(`${this.baseUrl}/f/create`, feeWithoutId);
  }

  getAllFees(): Observable<Fee[]> {
    return this.http.get<Fee[]>(`${this.baseUrl}/f/all`);
  }

  getStudentFees(studentId: number) {
    return this.http.get<Fee[]>(`http://localhost:8080/student/fees/${studentId}`);
  }

  updateFee(fee: Fee) {
    return this.http.put<Fee[]>(`${this.baseUrl}/f/update/${fee.id}`, fee);
  }

  deleteFee(feeId: number) {
    return this.http.delete<Fee[]>(`${this.baseUrl}/f/delete/${feeId}`);
  }



}

export interface Fee {
  id: number;
  feeType: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  student: {
    id: number;
  }
}