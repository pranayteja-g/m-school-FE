import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
    salaries: []
  };

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const employeeId = this.authService.getUserId();

    // Fetch all data in parallel
    Promise.all([
      this.http.get(`http://localhost:8080/employee/id/${employeeId}`).toPromise()
    ])
    .then(([profileData]: any[]) => {
      // Assign data to the relevant properties
      this.employeeData.profile = profileData;
      this.employeeData.classesTaught = profileData.classesTaught || [];
      this.employeeData.salaries = profileData.salaries || [];
    })
    .catch((error) => {
      console.error('Error fetching employee data:', error);
    });
  }
}