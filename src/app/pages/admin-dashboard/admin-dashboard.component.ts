import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ExamresultsComponent } from "../examresults/examresults.component";
import { FeesComponent } from "../fees/fees.component";
import { SalaryComponent } from "../salary/salary.component";
import { StudentComponent } from "../student/student.component";
import { EmployeeComponent } from "../employee/employee.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [NavbarComponent, ExamresultsComponent, FeesComponent, SalaryComponent, StudentComponent, EmployeeComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  allExamResults: any[];
  constructor() {
    this.allExamResults = [];
  }
}
