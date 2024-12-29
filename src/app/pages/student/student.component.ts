import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student',
  imports: [CommonModule, FormsModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
  studentId: number = 0;
  studentName: string = '';
  studentClass: string = '';
  section: string = '';
  rollNo: string = '';
  username: string = '';
  password: string = '';
  role: string = 'STUDENT';

  // Add a new property to hold search results
  studentsByName: any[] = [];

  student: any = {};  // to hold student data
  message: string = '';

  constructor(private studentService: StudentService, private router: Router) { }

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
        this.clearFields();  // Optional: Clear fields after successful update
      },
      error => {
        this.message = 'Error updating student';
        console.error(error);
      }
    );
  }

  // Delete student
  deleteStudent(): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(this.studentId).subscribe(
        response => {
          this.message = 'Student deleted successfully';
          console.log(response);
          this.clearFields();  // Optional: Clear fields after successful deletion
        },
        error => {
          this.message = 'Error deleting student';
          console.error(error);
        }
      );
    }
  }

  // Helper to clear input fields
  clearFields(): void {
    this.studentId = 0;
    this.studentName = '';
    this.studentClass = '';
    this.section = '';
    this.rollNo = '';
    this.username = '';
    this.password = '';
  }

  // Optionally fetch student data for editing
  fetchStudentData(): void {
    this.studentService.getStudentProfile(this.studentId).subscribe(
      response => {
        this.student = response;
        this.studentName = this.student.name;
        this.studentClass = this.student.studentClass;
        this.section = this.student.section;
        this.rollNo = this.student.rollNo;
        this.username = this.student.user.username;
        this.password = this.student.user.password;
      },
      error => {
        this.message = 'Error fetching student data';
        console.error(error);
      }
    );
  }
}