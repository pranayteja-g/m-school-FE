import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NavbarComponent } from "../navbar/navbar.component";
import { ExamResultRequest, ExamResultResponse, ExamResultService } from '../../services/admin/examresult.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-exam-results',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './examresults.component.html',
  styleUrls: ['./examresults.component.css']
})
export class ExamresultsComponent implements OnInit {
  examResultRequest: ExamResultRequest = {
    examType: '',
    totalMarks: 0,
    marksObtained: 0,
    subject: '',
    student: { id: 0 }
  };

  searchCriteria = {
    studentId: '',
    examType: '',
    studentClass: '',
    section: '',
    subject: ''
  };

  examResults: ExamResultResponse[] = []; // Original results fetched from the backend
  filteredExamResults: ExamResultResponse[] = []; // Results after filtering
  isLoading: boolean = false;

  currentPage: number = 0;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  action: 'create' | 'update' = 'create';
  message: string = '';
  resultIdToUpdate: number | null = null;

  private searchSubject = new Subject<void>();

  constructor(private examResultService: ExamResultService, private router: Router) {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.currentPage = 0; // Reset to first page when searching
      this.fetchExamResults();
    });
  }

  ngOnInit(): void {
    this.fetchExamResults();
  }

  fetchExamResults(): void {
    const { studentId, examType, studentClass, section, subject } = this.searchCriteria;
    this.isLoading = true;

    this.examResultService.getAllExamResults(this.currentPage, this.itemsPerPage, {
      studentId,
      examType,
      studentClass,
      section,
      subject
    }).subscribe(response => {
      this.examResults = response.content;
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
      this.filteredExamResults = this.examResults; // Display results initially
      this.isLoading = false;
    }, error => {
      console.error('Error fetching exam results', error);
      this.isLoading = false;
    });
  }

  onSearch(): void {
    this.searchSubject.next(); // Trigger search with debounced time
  }

  resetSearch(): void {
    this.searchCriteria = {
      studentId: '',
      examType: '',
      studentClass: '',
      section: '',
      subject: ''
    };
    this.fetchExamResults();
  }

  openModal(modalId: string, action: 'create' | 'update', resultId?: number): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      this.action = action;
      if (action === 'update' && resultId !== undefined) {
        this.resultIdToUpdate = resultId;
        this.populateResultDataForUpdate(resultId);
      } else {
        this.resetForm();
      }
    }
  }

  populateResultDataForUpdate(resultId: number): void {
    this.isLoading = true; // Start loading spinner

    this.examResultService.getExamResultById(resultId).subscribe(
      (examResult: ExamResultResponse) => {
        // Populate form fields with the fetched result
        this.examResultRequest = {
          id: examResult.id,
          examType: examResult.examType,
          totalMarks: examResult.totalMarks,
          marksObtained: examResult.marksObtained,
          subject: examResult.subject,
          student: {
            id: examResult.studentDto.id
          }
        };

        this.isLoading = false; // Stop loading spinner
      },
      (error) => {
        console.error('Error fetching exam result:', error);
        this.isLoading = false;
      }
    );
  }

  resetForm(): void {
    // Reset the form fields to initial empty or default values
    this.examResultRequest = {
      examType: '',
      totalMarks: 0,
      marksObtained: 0,
      subject: '',
      student: { id: 0 }
    };
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  createExamResult(): void {
    this.examResultService.createExamResult(this.examResultRequest).subscribe(
      response => {
        this.message = 'Exam result created successfully!';
        this.fetchExamResults(); // Refresh exam results
        this.closeModal('examResultModal');
      },
      error => {
        console.error('Error creating exam result', error);
      }
    );
  }

  updateExamResult(): void {
    if (this.resultIdToUpdate === null) return;

    this.examResultService.updateExamResult(this.examResultRequest).subscribe(
      response => {
        this.message = 'Exam result updated successfully!';
        this.fetchExamResults(); // Refresh exam results
        this.closeModal('examResultModal');
      },
      error => {
        console.error('Error updating exam result', error);
      }
    );
  }

  deleteExamResult(examResultId: number): void {
    this.examResultService.deleteExamResult(examResultId).subscribe(() => {
      this.message = 'Exam result deleted successfully!';
      this.fetchExamResults(); // Refresh exam results
    }, error => {
      console.error('Error deleting exam result', error);
    });
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchExamResults();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.fetchExamResults();
    }
  }
}
