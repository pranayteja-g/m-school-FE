import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-salary',
  imports: [CommonModule],
  templateUrl: './salary.component.html',
  styleUrl: './salary.component.css'
})
export class SalaryComponent {
  @Input() salaries: any[] = [];
  @Output() salarySelected = new EventEmitter<any>();

  constructor() {}

  selectSalary(salary: any) {
    this.salarySelected.emit(salary);
  }
}
