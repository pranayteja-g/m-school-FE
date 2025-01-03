import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateSalaryDto, Salary, SalaryService } from '../../services/admin/salary.service';
import { NavbarComponent } from "../navbar/navbar.component";
import * as bootstrap from 'bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-salary',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {

  salaries: Salary[] = [];
  startDate: string = '';
  endDate: string = '';
  searchEmployeeId: number | null = null;

  action: 'create' | 'update' = 'create';

  newSalary: CreateSalaryDto = {
    salaryAmount: 0,
    employee: { id: 0 }
  };

  createMode = false;

  editMode = false;
  editSalaryData: CreateSalaryDto = {
    salaryAmount: 0,
    employee: { id: 0 }
  };

  employeeId: number = 0;
  employeeSalaries: Salary[] = [];

  constructor(private readonly salaryService: SalaryService, public authService: AuthService) { }

  ngOnInit(): void {
    this.employeeId = Number(this.authService.getUserIdFromToken());
    const userRole = this.authService.getUserRole();
    if (userRole === 'ROLE_ADMIN') {
      this.getAllSalaries();
    } else {
      this.getSalaryByEmployeeId(this.employeeId);
    }
  }

  populateSalaryForUpdate(feeId: number) {
    throw new Error('Method not implemented.');
  }
  resetForm() {
    salaryAmount: 0;
    employee: { id: 0 };
  }

  openModal(modalId: string, action: 'create') {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      this.resetForm();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  getAllSalaries(): void {
    this.salaryService.getAllSalaries().subscribe({
      next: (data) => this.salaries = data || [],
      error: (err) => {
        console.error('Error fetching salaries:', err);
        this.salaries = [];
      }
    });
  }

  getSalaryByEmployeeId(employeeId: number): void {
    console.log('Employee ID:', this.employeeId);

    this.salaryService.getSalaryByEmployeeId(employeeId).subscribe({
      next: (data) => this.employeeSalaries = data || [],
      error: (err) => {
        console.error('Error fetching salary by employee ID:', err);
        alert('No records found for the given Employee ID.');
      }
    });
  }

  createSalary(form: NgForm): void {
    this.createMode = true;
    if (form.valid) {
      this.salaryService.createSalary(this.newSalary).subscribe({
        next: () => {
          this.getAllSalaries();
          form.resetForm();
          this.resetNewSalary();
        },
        error: (err) => console.error('Error creating salary:', err)
      });
    }
  }

  cancelCreate(): void {
    this.createMode = false;
    this.resetNewSalary();
  }

  editSalary(salary: Salary): void {
    this.editMode = true;
    this.editSalaryData = {
      salaryAmount: salary.salaryAmount,
      employee: { id: salary.employee.id }
    };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.resetEditSalary();
  }

  updateSalary(): void {
    this.salaryService.updateSalary(this.editSalaryData.employee.id, this.editSalaryData).subscribe({
      next: () => {
        this.getAllSalaries();
        this.cancelEdit();
      },
      error: (err) => console.error('Error updating salary:', err)
    });
  }

  deleteSalary(salaryId: number): void {
    if (confirm('Are you sure you want to delete this salary record?')) {
      this.salaryService.deleteSalary(salaryId).subscribe({
        next: () => {
          this.salaries = this.salaries.filter(salary => salary.id !== salaryId);
          alert('Salary record deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting salary:', err);
          alert('Failed to delete the salary record. Please try again.');
        }
      });
    }
  }

  filterSalariesByDate(): void {
    if (this.startDate && this.endDate) {
      this.salaryService.getSalariesBetween(this.startDate, this.endDate).subscribe({
        next: (data) => this.salaries = data || [],
        error: (err) => {
          console.error('Error fetching salaries between dates:', err);
          alert('Failed to filter salaries. Please try again.');
        }
      });
    } else {
      alert('Please select both start and end dates.');
    }
  }

  searchByEmployeeId(): void {
    if (this.searchEmployeeId !== null) {
      this.salaryService.getSalaryByEmployeeId(this.searchEmployeeId).subscribe({
        next: (data) => this.salaries = data || [],
        error: (err) => {
          console.error('Error fetching salary by employee ID:', err);
          alert('No records found for the given Employee ID.');
        }
      });
    }
  }

  private resetNewSalary(): void {
    this.newSalary = {
      salaryAmount: 0,
      employee: { id: 0 }
    };
  }

  private resetEditSalary(): void {
    this.editSalaryData = {
      salaryAmount: 0,
      employee: { id: 0 }
    };
  }
}
