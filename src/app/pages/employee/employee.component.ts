import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  employeeId: number = 0;
  employeeName: string = '';
  employeeUsername: string = '';
  employeePassword: string = '';
  employeeRole: string = 'EMPLOYEE';
  employeeData: any = {};  // Holds employee data for editing
  allEmployees: any[] = [];
  message: string = '';
  subject !: string;
  classesTaught: string[] = [];
  classesTaughtString: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) { }

  // Create a new employee
  createEmployee(): void {
    // Split the classes taught input into an array
    this.classesTaught = this.classesTaughtString.split(',').map((item: string) => item.trim());

    const employeeData = {
      name: this.employeeName,
      subject: this.subject,
      classesTaught: this.classesTaught,
      user: {
        username: this.employeeUsername,
        password: this.employeePassword,
        role: this.employeeRole
      }
    };

    // Now call the service
    this.employeeService.createEmployee(employeeData).subscribe(
      response => {
        this.message = 'Employee created successfully';
        console.log(response);
      },
      error => {
        this.message = 'Error creating employee';
        console.error(error);
      }
    );
  }

  // Update employee details
  updateEmployee(): void {
    const updatedEmployeeData = {
      name: this.employeeName,
      user: {
        username: this.employeeUsername,
        password: this.employeePassword,
        role: this.employeeRole
      }
    };

    this.employeeService.updateEmployee(this.employeeId, updatedEmployeeData).subscribe(
      response => {
        this.message = 'Employee updated successfully';
        console.log(response);
      },
      error => {
        this.message = 'Error updating employee';
        console.error(error);
      }
    );
  }

  // Delete employee by ID
  deleteEmployee(): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(this.employeeId).subscribe(
        response => {
          this.message = 'Employee deleted successfully';
          console.log(response);
        },
        error => {
          this.message = 'Error deleting employee';
          console.error(error);
        }
      );
    }
  }

  // Fetch employee details for editing
  fetchEmployeeData(): void {
    this.employeeService.getEmployeeProfile(this.employeeId).subscribe(
      response => {
        this.employeeData = response;
        this.employeeName = this.employeeData.name;
        this.employeeUsername = this.employeeData.username;
        this.employeeRole = this.employeeData.role;
      },
      error => {
        this.message = 'Error fetching employee data';
        console.error(error);
      }
    );
  }

  // Fetch all employees (Admin)
  fetchAllEmployees(): void {
    this.employeeService.getAllEmployees().subscribe(
      response => {
        this.allEmployees = response;
        console.log(response);
      },
      error => {
        this.message = 'Error fetching all employees';
        console.error(error);
      }
    );
  }
}