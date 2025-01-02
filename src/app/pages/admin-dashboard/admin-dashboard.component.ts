import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterLink } from '@angular/router';
import { FeeResponse } from '../../services/admin/fee.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  allExamResults: any[];
  fees: FeeResponse[] = [];
  constructor() {
    this.allExamResults = [];
  }
}
