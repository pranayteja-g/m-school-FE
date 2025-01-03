import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NavbarComponent } from "../navbar/navbar.component";
import { ExamResultRequest, ExamResultResponse, ExamResultService } from '../../services/admin/examresult.service';

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

  examResults: ExamResultResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  isLoading: boolean = true;
  action: 'create' | 'update' = 'create';
  message: string = '';
  resultIdToUpdate: number | null = null;

  constructor(private examResultService: ExamResultService, private router: Router) { }

  ngOnInit(): void {
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
    this.examResultService.getAllExamResults(this.currentPage, this.itemsPerPage).subscribe(
      response => {
        this.examResults = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching exam results:', error);
        this.isLoading = false;
      }
    );
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
}