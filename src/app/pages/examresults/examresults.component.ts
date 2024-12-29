import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ExamresultService } from '../../services/admin/examresult.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-examresults',
  imports: [CommonModule, FormsModule],
  templateUrl: './examresults.component.html',
  styleUrl: './examresults.component.css'
})
export class ExamresultsComponent implements OnInit {
  studentId: number = 0; // Bind this to the input field
  examResultsForStudentId: any[] = [];
  examResults: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(private examResultService: ExamresultService) { }
  ngOnInit(): void {
    this.fetchExamResults();
  }

  fetchExamResults(): void {
    this.examResultService.getExamResults(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.examResults = data.content || [];
        this.totalPages = data.totalPages || 0;
      },
      error: (err) => {
        console.error('Error fetching exam results:', err);
      }
    });
  }

  // getAllExamResultsByStudentId(): void {
  //   if (this.studentId > 0) {
  //     this.examResultService.getAllExamResultsByStudentId(this.studentId, this.currentPage, this.pageSize).subscribe({
  //       next: (data) => {
  //         this.examResultsForStudentId = data.content || [];
  //         this.totalPages = data.totalPages || 0;
  //       },
  //       error: (err) => {
  //         console.error('Error fetching exam results:', err);
  //       }
  //     });
  //   } else {
  //     console.warn('Please enter a valid Student ID');
  //   }
  // }

  getAllExamResultsByStudentId(): void {
    if (!this.studentId) {
      // If the input is cleared, reset the exam results
      this.examResultsForStudentId = [];
      this.totalPages = 0;
    } else {
      // Fetch the exam results based on the student ID
      this.examResultService.getAllExamResultsByStudentId(this.studentId, this.currentPage, this.pageSize).subscribe({
        next: (data) => {
          this.examResultsForStudentId = data.content || [];
          this.totalPages = data.totalPages || 0;
        },
        error: (err) => {
          console.error('Error fetching exam results:', err);
        }
      });
    }
  }

  changePage(offset: number): void {
    const newPage = this.currentPage + offset;
    if (newPage >= 0 && newPage < this.totalPages) {
      this.currentPage = newPage;
      this.getAllExamResultsByStudentId();
    }
  }
}