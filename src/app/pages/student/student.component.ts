import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student, StudentService } from '../../services/student.service';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-student',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {
  studentId: number = 0;
  studentName: string = '';
  studentClass: string = '';
  section: string = '';
  rollNo: string = '';
  username: string = '';
  password: string = '';
  role: string = 'STUDENT';

  isLoading: boolean = true;
  searchQuery: string = '';

  // Add a new property to hold search results
  studentsByName: any[] = [];

  students: Student[] = [];  // Store all students

  student: any = {};  // to hold student data
  filteredList: Student[] = [];
  paginatedStudents: Student[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 5;


  message: string = '';
  action: 'create' | 'update' = 'create';


  constructor(private studentService: StudentService, private router: Router) { }
  ngOnInit(): void {
    this.fetchAllStudents();
  }

  // Open modal for create or update
  openModal(modalId: string, action: 'create' | 'update', studentId?: number): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      this.action = action;

      if (action === 'update' && studentId) {
        this.studentId = studentId; // Save the ID of the studentId to update
        this.fetchStudentDataForUpdate(studentId); // Fetch data for update
      } else {
        this.resetForm(); // Reset form for creating new studentId
      }
    } else {
      console.error('Modal element not found');
    }
  }

  // Close modal
  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal!.hide();
    } else {
      console.error('Modal element not found');
    }
  }


  fetchAllStudents(): void {
    this.isLoading = true;
    this.studentService.getAllStudents().subscribe({
      next: (response) => {
        this.students = response;
        this.filterStudents();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching students:', error);
        this.message = 'Error fetching students';
        this.isLoading = false;
      }
    });
  }

  private filterStudents(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredList = query ?
      this.students.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.id.toString().includes(query)
      ) :
      [...this.students];

    this.currentPage = 0;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStudents = this.filteredList.slice(startIndex, endIndex);
  }

  goToNextPage(): void {
    if ((this.currentPage + 1) * this.itemsPerPage < this.filteredList.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredList.length / this.itemsPerPage);
  }

  onSearchQueryChange(): void {
    this.filterStudents();
  }


  // Create student
  createStudent(): void {
    const studentData = {
      name: this.studentName,
      studentClass: this.studentClass,
      section: this.section,
      rollNo: this.rollNo,
      user: {
        username: this.username,
        password: this.password,
        role: this.role
      }
    };

    this.studentService.createStudent(studentData).subscribe(
      response => {
        this.message = 'Student created successfully';
        console.log(response);
        this.fetchAllStudents();  // Refresh student list
        alert("student created successfully");
        this.closeModal('studentModal');
      },
      error => {
        this.message = 'Error creating student';
        console.error(error);
      }
    );
  }

  // method for searching students by name
  searchStudentsByName(): void {
    if (this.studentName.trim() === '') {
      this.message = 'Please enter a student name to search.';
      return;
    }

    this.studentService.getStudentsByName(this.studentName).subscribe(
      response => {
        this.studentsByName = response;
        this.message = `${response.length} student(s) found.`;
        console.log(response);
      },
      error => {
        this.studentsByName = [];
        this.message = 'Error fetching students by name';
        console.error(error);
      }
    );
  }

  // Update student
  updateStudent(): void {
    const updatedStudentData = {
      name: this.studentName,
      studentClass: this.studentClass,
      section: this.section,
      rollNo: this.rollNo,
      user: {
        username: this.username,
        password: this.password,
        role: this.role
      }
    };

    this.studentService.updateStudent(this.studentId, updatedStudentData).subscribe(
      response => {
        this.message = 'Student updated successfully';
        console.log(response);
        alert("student updated successfully");
        this.fetchAllStudents();  // Refresh student list
        this.closeModal('studentModal');
      },
      error => {
        this.message = 'Error updating student';
        console.error(error);
      }
    );
  }

  // Delete student
  deleteStudent(studentId: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentId).subscribe(
        response => {
          this.message = 'Student deleted successfully';
          console.log(response);
          this.fetchAllStudents();  // Refresh student list
          this.resetForm();  // Optional: Clear fields after successful deletion
        },
        error => {
          this.message = 'Error deleting student';
          console.error(error);
        }
      );
    }
  }

  // Optionally fetch student data for editing
  fetchStudentDataForUpdate(studentId: number): void {
    this.studentService.getStudentProfile(this.studentId).subscribe(
      response => {
        this.student = response;
        this.studentName = this.student.name;
        this.studentClass = this.student.studentClass;
        this.section = this.student.section;
        this.rollNo = this.student.rollNo;
        this.username = this.student.user.username;
      },
      error => {
        this.message = 'Error fetching student data';
        console.error(error);
      }
    );
  }

  resetForm(): void {
    this.studentId = 0;
    this.studentName = '';
    this.studentClass = '';
    this.section = '';
    this.rollNo = '';
    this.username = '';
    this.password = '';
    this.role = 'STUDENT';
  }
}