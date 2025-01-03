import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { HttpClient } from '@angular/common/http';
import { ExamResultDto, ExamResultService, Page } from '../../services/admin/examresult.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  studentProfile: any = {};
  examResults: ExamResultDto[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  fees: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private examResultService: ExamResultService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const studentId = this.authService.getUserId();
    if (studentId) {
      this.loadStudentProfile(studentId);
      this.loadExamResults(studentId, this.currentPage, this.pageSize);
      this.loadFees(studentId);
    } else {
      this.error = 'User ID not found';
    }
  }

  loadStudentProfile(studentId: number): void {
    this.loading = true;
    this.http.get(`http://localhost:8080/student/id/${studentId}`).subscribe({
      next: (data: any) => {
        this.studentProfile = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading profile';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  loadExamResults(studentId: number, page: number, size: number): void {
    this.loading = true;
    this.examResultService.getStudentExamResults(studentId, page, size).subscribe({
      next: (data: Page<ExamResultDto>) => {
        this.examResults = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading exam results';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  changePage(offset: number): void {
    const newPage = this.currentPage + offset;
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.loadExamResults(this.authService.getUserId(), this.currentPage, this.pageSize);
    }
  }

  loadFees(studentId: number): void {
    this.loading = true;
    this.http.get(`http://localhost:8080/student/fees/${studentId}`).subscribe({
      next: (data: any) => {
        this.fees = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading fees';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }
}
