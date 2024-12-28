import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-dashboard',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {
  employeeData: any = {
    profile: {},
    classesTaught: [],
    salaries: [],
  };

  employeeId!: number;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.employeeId = this.authService.getUserId();
    this.loadEmployeeProfile();
  }

  loadEmployeeProfile(): void {
    this.employeeService.getEmployeeProfile(this.employeeId).subscribe({
      next: (data) => {
        this.employeeData.profile = data;
        this.employeeData.classesTaught = data.classesTaught || [];
        this.employeeData.salaries = data.salaries || [];
      },
      error: (err) => console.error('Error fetching employee profile:', err),
    });
  }
}