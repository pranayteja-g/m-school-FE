import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Salary, SalaryService } from '../../services/admin/salary.service';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-salary',
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.css'
})
export class SalaryComponent implements OnInit {
  salaries: Salary[] = [];
  employeeId!: number; // For fetching salary by employee ID
  startDate!: string; // Start date for filtering salary
  endDate!: string; // End date for filtering salary



  newSalary: Salary = {
    id: 0,
    employeeId: 0,
    salaryAmount: 0,
    createdDate: new Date(),
    status: 'Unpaid'
  };
  editMode = false;
  editSalaryData: Salary = { ...this.newSalary };

  constructor(private salaryService: SalaryService, private http: HttpClient) { }
  ngOnInit(): void {
    this.getAllSalaries();
  }

  getAllSalaries(): void {
    this.salaryService.getAllSalaries().subscribe({
      next: (data) => (this.salaries = data || []), // Default to empty array
      error: (err) => {
        console.error('Error fetching salaries:', err);
        this.salaries = []; // Fallback to empty array
      },
    });
  }

  filterSalariesByDate(): void {
    if (this.startDate && this.endDate) {
      const formattedStartDate = `${this.startDate}T00:00:00`;
      const formattedEndDate = `${this.endDate}T23:59:59`;
      this.salaryService.getSalariesBetween(formattedStartDate, formattedEndDate).subscribe({
        next: (data) => (this.salaries = data || []), // Default to empty array
        error: (err) => {
          console.error('Error filtering salaries by date:', err);
          this.salaries = []; // Fallback to empty array
        },
      });
    } else {
      alert('Please select both start and end dates.');
    }
  }
  getSalaryByEmployeeId(): void {
    if (!this.employeeId) {
      // If the input is cleared, fetch all salaries
      this.getAllSalaries();
    } else {
      this.salaryService.getSalaryByEmployeeId(this.employeeId).subscribe({
        next: (data) => (this.salaries = data),
        error: (err) => console.error('Error fetching salary by employee ID:', err),
      });
    }
  }


  createSalary(form: NgForm): void {
    if (form.valid) {
      this.salaryService.createSalary(this.newSalary).subscribe({
        next: () => {
          this.getAllSalaries();
          form.resetForm();
        },
        error: (err) => console.error('Error creating salary:', err),
      });
    }
  }

  editSalary(salary: Salary): void {
    this.editMode = true;
    this.editSalaryData = { ...salary };
  }

  updateSalary(salary: Salary): void {
    this.salaryService.updateSalary(salary.id, salary).subscribe({
      next: () => {
        this.getAllSalaries();
        this.editMode = false;
      },
      error: (err) => console.error('Error updating salary:', err),
    });
  }

  deleteSalary(id: number): void {
    this.salaryService.deleteSalary(id).subscribe({
      next: () => this.getAllSalaries(),
      error: (err) => console.error('Error deleting salary:', err),
    });
  }

  cancelEdit(): void {
    this.editMode = false;
  }


}