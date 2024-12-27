import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  studentProfile: any = {};
  examResults: any[] = [];
  fees: any[] = [];
  studentId !: number; // Get student ID from the token or a global service

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const studentId = this.authService.getUserId(); // Get the userId from the AuthService
    this.loadStudentProfile(studentId);
    this.loadExamResults(studentId);
    this.loadFees(studentId);
  }

  loadStudentProfile(studentId: number): void {
    this.http.get(`http://localhost:8080/student/id/${studentId}`)
      .subscribe((data: any) => {
        this.studentProfile = data;
      });
  }

  loadExamResults(studentId: number): void {
    this.http.get(`http://localhost:8080/student/results/${studentId}`)
      .subscribe((data: any) => {
        this.examResults = data;
      });
  }

  loadFees(studentId: number): void {
    this.http.get(`http://localhost:8080/student/fees/${studentId}`)
      .subscribe((data: any) => {
        this.fees = data;
      });
  }
}
