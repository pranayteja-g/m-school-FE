import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ExamresultsComponent } from "../examresults/examresults.component";
import { FeesComponent } from "../fees/fees.component";
import { SalaryComponent } from "../salary/salary.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [NavbarComponent, ExamresultsComponent, FeesComponent, SalaryComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  allExamResults: any[];
  constructor() {
    this.allExamResults = [];
  }
}
