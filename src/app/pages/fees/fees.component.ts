import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Fee, FeeService } from '../../services/admin/fee.service';

@Component({
  selector: 'app-fees',
  imports: [CommonModule],
  templateUrl: './fees.component.html',
  styleUrl: './fees.component.css'
})
export class FeesComponent {
  fees: Fee[] = [];
  studentId!: number; // For fetching fees by student ID

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    this.getAllFees();
  }

  getAllFees(): void {
    this.feeService.getAllFees().subscribe({
      next: (data) => (this.fees = data || []),
      error: (err) => {
        console.error('Error fetching fees:', err);
        this.fees = [];
      },
    });
  }


} 