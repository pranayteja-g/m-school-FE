import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FeeService {

  private baseUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  createFee(fee: Fee) {
    return this.http.post<Fee[]>(`${this.baseUrl}/f/create`, fee);
  }

  updateFee(fee: Fee) {
    return this.http.put<Fee[]>(`${this.baseUrl}/f/update/\${fee.id}`, fee);
  }

  deleteFee(feeId: number) {
    return this.http.delete<Fee[]>(`${this.baseUrl}/f/delete/${feeId}`);
  }



}

export interface Fee {
  id: number;
  studentId: number;
  feeType: string;
  amount: number;
  status: string;
}
