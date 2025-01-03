import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamResultService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  createExamResult(examResult: Omit<ExamResultRequest, 'id'>): Observable<ExamResultResponse> {
    return this.http.post<ExamResultResponse>(`${this.baseUrl}/results/create`, examResult);
  }

  getAllExamResults(
    page: number, 
    size: number, 
    searchParams?: {
      studentId?: string,
      examType?: string,
      studentClass?: string,
      section?: string,
      subject?: string
    }
  ): Observable<PageResponse<ExamResultResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<PageResponse<ExamResultResponse>>(`${this.baseUrl}/results/getall`, { params });
  }

  getStudentExamResults(studentId: number, page: number, size: number): Observable<PageResponse<ExamResultResponse>> {
    return this.http.get<PageResponse<ExamResultResponse>>(`${this.baseUrl}/student/student-id/${studentId}/exam-results?page=${page}&size=${size}`);
  }

  updateExamResult(examResult: ExamResultRequest): Observable<ExamResultResponse> {
    return this.http.put<ExamResultResponse>(`${this.baseUrl}/results/update/${examResult.id}`, examResult);
  }

  deleteExamResult(examResultId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/results/delete/${examResultId}`);
  }
}

export interface ExamResultResponse {
  id: number;
  examType: string;
  totalMarks: number;
  marksObtained: number;
  subject: string;
  studentDto: {
    id: number;
    name: string;
    studentClass: string;
    section: string;
    rollNo: string;
  };
}

export interface ExamResultRequest {
  id?: number;
  examType: string;
  totalMarks: number;
  marksObtained: number;
  subject: string;
  student: {
    id: number;
  };
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}