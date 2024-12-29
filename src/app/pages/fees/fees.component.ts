import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Fee, FeeService } from '../../services/admin/fee.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fees',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {
  fees: Fee[] = [];
  newFee: Omit<Fee, 'id'> = {
    feeType: '',
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    student: { id: 0 },
  };

  constructor(private feeService: FeeService) { }

  ngOnInit(): void {
    this.getAllFees();
  }
  getAllFees(): void {
    this.feeService.getAllFees().subscribe({
      next: (data) => (this.fees = data),
      error: (err) => console.error('Error fetching fees:', err),
    });
  }

  createFee(): void {
    const feeToCreate = {
      ...this.newFee,
      dueAmount: this.newFee.totalAmount - this.newFee.paidAmount
    };

    console.log('Sending fee data:', feeToCreate); // Log what we're sending

    this.feeService.createFee(feeToCreate).subscribe({
      next: (response) => {
        console.log('Server response:', response); // Log the server response
        this.getAllFees();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating fee:', err);
        console.log('Failed request payload:', feeToCreate); // Log the failed request data
      },
    });
  }

  resetForm(): void {
    this.newFee = {
      feeType: '',
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      student: { id: 0 },
    };
  }
}