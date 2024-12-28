import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamresultService {

  private baseUrl = 'http://localhost:8080/results';

  constructor(private http: HttpClient) { }

  createExamResult(examResult: ExamResult) {
    return this.http.post<ExamResult[]>(`${this.baseUrl}/create`, examResult);
  }

  getAllExamResults(studentId: number, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`http://localhost:8080/student/student-id/${studentId}/exam-results`, { params });
  }

  updateExamResult(id: number, examResult: ExamResult) {
    return this.http.put<ExamResult[]>(`${this.baseUrl}/update/${id}`, examResult);
  }

  deleteExamResult(examResultId: number) {
    return this.http.delete<ExamResult[]>(`${this.baseUrl}/delete/${examResultId}`);
  }
}

export interface ExamResult {
  id: number;
  studentId: number;
  examType: string;
  marksObtained: number;
  totalMarks: number;
}
