import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ExamresultsComponent } from "../examresults/examresults.component";
import { FeesComponent } from "../fees/fees.component";
import { SalaryComponent } from "../salary/salary.component";
import { StudentComponent } from "../student/student.component";
import { EmployeeComponent } from "../employee/employee.component";
import { Fee } from '../../services/admin/fee.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, RouterOutlet, NavbarComponent, ExamresultsComponent, FeesComponent, SalaryComponent, StudentComponent, EmployeeComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  allExamResults: any[];
  fees: Fee[] = [];
  constructor() {
    this.allExamResults = [];
  }
}
