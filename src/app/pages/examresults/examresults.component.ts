import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NavbarComponent } from "../navbar/navbar.component";
import { debounceTime, Subject } from 'rxjs';
import { ExamResultRequest, ExamResultResponse, ExamResultService } from '../../services/admin/examresult.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(private examResultService: ExamResultService, private router: Router, private authService: AuthService) {
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
    this.updateDisplayedResults();
  }

  onSearch(): void {
    const { studentId, examType, studentClass, section, subject } = this.searchCriteria;

    this.filteredExamResults = this.examResults.filter((result) => {
      return (
        (!studentId || result.studentDto.id.toString().includes(studentId)) &&
        (!examType || result.examType.toLowerCase().includes(examType.toLowerCase())) &&
        (!studentClass || result.studentDto.studentClass.toLowerCase().includes(studentClass.toLowerCase())) &&
        (!section || result.studentDto.section.toLowerCase().includes(section.toLowerCase())) &&
        (!subject || result.subject.toLowerCase().includes(subject.toLowerCase()))
      );
    });
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
        this.message = 'Exam result created successfully';
        this.fetchExamResults();
        this.closeModal('examResultModal');
        alert('Exam result created successfully');
      },
      error => {
        console.error('Error creating exam result:', error);
        this.message = 'Error creating exam result';
      }
    );
  }

  updateExamResult(): void {
    if (this.resultIdToUpdate === null) return;

    const updatedRequest: ExamResultRequest = {
      ...this.examResultRequest,
      id: this.resultIdToUpdate
    };

    this.examResultService.updateExamResult(updatedRequest).subscribe(
      response => {
        this.message = 'Exam result updated successfully';
        this.fetchExamResults();
        this.closeModal('examResultModal');
        alert('Exam result updated successfully');
      },
      error => {
        console.error('Error updating exam result:', error);
        this.message = 'Error updating exam result';
      }
    );
  }

  deleteExamResult(resultId: number): void {
    if (confirm('Are you sure you want to delete this exam result?')) {
      this.examResultService.deleteExamResult(resultId).subscribe(
        () => {
          this.message = 'Exam result deleted successfully';
          alert('Exam result deleted successfully');
          this.fetchExamResults();
        },
        error => {
          console.error('Error deleting exam result:', error);
          this.message = 'Error deleting exam result';
        }
      );
    }
  }

  populateResultDataForUpdate(resultId: number): void {
    const resultToEdit = this.examResults.find(r => r.id === resultId);
    if (resultToEdit) {
      this.examResultRequest = {
        examType: resultToEdit.examType,
        totalMarks: resultToEdit.totalMarks,
        marksObtained: resultToEdit.marksObtained,
        subject: resultToEdit.subject,
        student: {
          id: resultToEdit.studentDto.id
        }
      };
    }
  }
  fetchExamResults(): void {
    this.isLoading = true;

    this.examResultService.getAllExamResults(this.currentPage, this.itemsPerPage, {})
      .subscribe({
        next: (response) => {
          this.examResults = response.content; // API response for the current page
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.filteredExamResults = this.examResults; // No slicing required here
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching exam results:', err);
          this.isLoading = false;
        }
      });
  }

  clearSearch(): void {
    this.searchCriteria = {
      studentId: '',
      examType: '',
      studentClass: '',
      section: '',
      subject: ''
    };
    this.currentPage = 0;
    this.fetchExamResults();
  }

  updateDisplayedResults(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Slice the filteredExamResults array for current page
    this.filteredExamResults = this.examResults.slice(startIndex, endIndex);
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchExamResults();
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.fetchExamResults();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchExamResults();
    }
  }

  resetForm(): void {
    this.examResultRequest = {
      examType: '',
      totalMarks: 0,
      marksObtained: 0,
      subject: '',
      student: { id: 0 }
    };
  }

  navigateToHome(): void {
    const dashboardRoute = this.authService.getDashboardRoute();
    this.router.navigate([dashboardRoute]);
  }
}
