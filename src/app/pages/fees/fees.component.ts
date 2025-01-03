import { Component, OnInit } from '@angular/core';
import { FeeService, FeeRequest, FeeResponse } from '../../services/admin/fee.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {
  feeRequest: FeeRequest = {
    feeType: '',
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    student: { id: 0 }
  };

  fees: FeeResponse[] = [];
  filteredFees: FeeResponse[] = [];
  paginatedFees: FeeResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 5;
  searchQuery: string = '';
  isLoading: boolean = true;
  action: 'create' | 'update' = 'create';
  message: string = '';
  feeIdToUpdate: number | null = null;
  
  get totalPages(): number {
    return Math.ceil(this.filteredFees.length / this.itemsPerPage);
  }

  constructor(private feeService: FeeService, private router: Router) { }

  ngOnInit(): void {
    this.fetchAllFees();
  }

  openModal(modalId: string, action: 'create' | 'update', feeId?: number): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      this.action = action;
      if (action === 'update' && feeId !== undefined) {
        this.feeIdToUpdate = feeId;
        this.populateFeeDataForUpdate(feeId);
      } else {
        this.resetForm();
      }
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  createFee(): void {
    this.feeRequest.dueAmount = this.feeRequest.totalAmount - this.feeRequest.paidAmount;

    this.feeService.createFee(this.feeRequest).subscribe(
      response => {
        this.message = 'Fee created successfully';
        this.fetchAllFees();
        this.closeModal('feeModal');
        alert('Fee created successfully');
      },
      error => {
        console.error('Error creating fee:', error);
        this.message = 'Error creating fee';
      }
    );
  }

  updateFee(): void {
    if (this.feeIdToUpdate === null) return;

    const updatedFeeRequest: FeeRequest = {
      ...this.feeRequest,
      dueAmount: this.feeRequest.totalAmount - this.feeRequest.paidAmount
    };

    this.feeService.updateFee({ id: this.feeIdToUpdate, ...updatedFeeRequest }).subscribe(
      response => {
        this.message = 'Fee updated successfully';
        this.fetchAllFees();
        this.closeModal('feeModal');
        alert('Fee updated successfully');
      },
      error => {
        console.error('Error updating fee:', error);
        this.message = 'Error updating fee';
      }
    );
  }

  deleteFee(feeId: number): void {
    if (confirm('Are you sure you want to delete this fee?')) {
      this.feeService.deleteFee(feeId).subscribe(
        response => {
          this.message = 'Fee deleted successfully';
          alert('Fee deleted successfully');
          this.fetchAllFees();
        },
        error => {
          console.error('Error deleting fee:', error);
          this.message = 'Error deleting fee';
        }
      );
    }
  }

  populateFeeDataForUpdate(feeId: number): void {
    const feeToEdit = this.fees.find(f => f.id === feeId);
    if (feeToEdit) {
      this.feeRequest = {
        feeType: feeToEdit.feeType,
        totalAmount: feeToEdit.totalAmount,
        paidAmount: feeToEdit.paidAmount,
        dueAmount: feeToEdit.dueAmount,
        student: {
          id: feeToEdit.studentDto.id
        }
      };
    }
  }

  fetchAllFees(): void {
    this.isLoading = true;
    this.feeService.getAllFees().subscribe(
      response => {
        this.fees = response;
        this.filterFees();
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching fees:', error);
        this.isLoading = false;
      }
    );
  }

  filterFees(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredFees = query
      ? this.fees.filter(fee =>
        fee.feeType.toLowerCase().includes(query) ||
        fee.studentDto.name.toLowerCase().includes(query)
      )
      : [...this.fees];

    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFees = this.filteredFees.slice(startIndex, endIndex);
    // this.totalPages = Math.ceil(this.filteredFees.length / this.itemsPerPage);
  }

  goToNextPage(): void {
    if ((this.currentPage + 1) * this.itemsPerPage < this.filteredFees.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  onSearchQueryChange(): void {
    this.filterFees();
  }


  resetForm(): void {
    this.feeRequest = {
      feeType: '',
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      student: { id: 0 }
    };
  }
}
