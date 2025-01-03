import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  // studentProfile: any = {};

  // examResultsForStudentId: any[] = [];
  // examResults: any[] = [];
  // currentPage: number = 0;
  // pageSize: number = 10;
  // totalPages: number = 0;

  // fees: any[] = [];

  // studentId !: number; // Get student ID from the token or a global service

  // constructor(private http: HttpClient,
  //   private examResultService: ExamResultService,
  //   private router: Router,
  //   private authService: AuthService
  // ) { }

  // ngOnInit(): void {
  //   const studentId = this.authService.getUserId(); // Get the userId from the AuthService
  //   this.loadStudentProfile(studentId);
  //   // this.getAllExamResultsByStudentId(studentId); // Pass the studentId directly here
  //   this.loadFees(studentId);
  // }

  // loadStudentProfile(studentId: number): void {
  //   this.http.get(`http://localhost:8080/student/id/${studentId}`)
  //     .subscribe((data: any) => {
  //       this.studentProfile = data;
  //     });
  // }

  // // // Fetch exam results using the new pagination method
  // // getAllExamResultsByStudentId(studentId: number): void {
  // //   // Remove the this.studentId check since we know we have a valid ID
  // //   this.examResultService.getExamResultsByStudentId(
  // //     studentId,
  // //     this.currentPage,
  // //     this.pageSize
  // //   ).subscribe({
  // //     next: (data) => {
  // //       this.examResultsForStudentId = data.content || [];
  // //       this.totalPages = data.totalPages || 0;
  // //     },
  // //     error: (err) => {
  // //       console.error('Error fetching exam results:', err);
  // //     }
  // //   });
  // // }

  // // changePage(offset: number): void {
  // //   const newPage = this.currentPage + offset;
  // //   if (newPage >= 0 && newPage < this.totalPages) {
  // //     this.currentPage = newPage;
  // //     this.getAllExamResultsByStudentId(this.studentId);
  // //   }
  // // }



  // loadFees(studentId: number): void {
  //   this.http.get(`http://localhost:8080/student/fees/${studentId}`)
  //     .subscribe((data: any) => {
  //       this.fees = data;
  //     });
  // }
}
