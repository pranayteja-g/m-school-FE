import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  studentProfile: any = {};
  examResults: any[] = [];
  fees: any[] = [];
  studentId!: number;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.studentId = this.authService.getUserId();
    this.loadStudentProfile();
    this.loadExamResults();
    this.loadFees();
  }

  loadStudentProfile(): void {
    this.studentService.getStudentProfile(this.studentId).subscribe({
      next: (data) => (this.studentProfile = data),
      error: (err) => console.error('Error fetching student profile:', err),
    });
  }

  loadExamResults(): void {
    this.studentService.getExamResults(this.studentId).subscribe({
      next: (data) => (this.examResults = data),
      error: (err) => console.error('Error fetching exam results:', err),
    });
  }

  loadFees(): void {
    this.studentService.getFees(this.studentId).subscribe({
      next: (data) => (this.fees = data),
      error: (err) => console.error('Error fetching fees:', err),
    });
  }
}