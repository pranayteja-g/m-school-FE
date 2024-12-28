import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExamresultService } from '../../services/admin/examresult.service';

@Component({
  selector: 'app-examresults',
  imports: [CommonModule],
  templateUrl: './examresults.component.html',
  styleUrl: './examresults.component.css'
})
export class ExamresultsComponent {
  // @Input() examResults: any[] = [];
  @Input() studentId: number = 0; // Pass the student ID as input to the component
  examResults: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  constructor(private examResultService: ExamresultService) {
    this.examResults = [];
  }
  ngOnInit(): void {
    if (this.studentId > 0) {
      this.getAllExamResults(this.studentId, this.currentPage, this.pageSize);
    }
  }

  getAllExamResults(studentId: number, page: number, size: number): void {
    this.examResultService.getAllExamResults(studentId, page, size).subscribe({
      next: (data) => {
        this.examResults = data.content || [];
        this.totalPages = data.totalPages || 0;
      },
      error: (err) => {
        console.error('Error fetching exam results:', err);
      }
    });
  }
}
