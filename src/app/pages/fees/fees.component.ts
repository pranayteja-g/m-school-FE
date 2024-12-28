import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fees',
  imports: [CommonModule],
  templateUrl: './fees.component.html',
  styleUrl: './fees.component.css'
})
export class FeesComponent {
  @Input() fees: any[] = []; // Accept data from parent
}
