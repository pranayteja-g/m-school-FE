import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  pagename: string = ''; // Holds the page name for the title
  navLinks: { name: string, path: string }[] = []; // Holds the navigation links

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title) { }

  ngOnInit(): void {
    // Ensure initial page details are set when the component loads
    this.updatePageDetails();

    // Listen for router events to dynamically update the title and nav links
    this.router.events.subscribe(() => {
      this.updatePageDetails();
    });
  }

  // Update page name and nav links dynamically based on the current route
  private updatePageDetails(): void {
    const currentRoute = this.router.url;
    this.pagename = this.getPageName(currentRoute);
    this.navLinks = this.getNavLinks(currentRoute);
    this.titleService.setTitle(this.pagename); // Dynamically update browser tab title
  }

  // Map route to a user-friendly page name
  private getPageName(route: string): string {
    if (route.includes('studentdashboard')) {
      return 'Student Dashboard';
    } else if (route.includes('admindashboard')) {
      return 'Admin Dashboard';
    } else if (route.includes('employeedashboard')) {
      return 'Employee Dashboard';
    }
    return 'Unknown Page'; // Default if no match
  }

  // Map route to corresponding navigation links
  private getNavLinks(route: string): { name: string, path: string }[] {
    if (route.includes('student-dashboard')) {
      return [
        { name: 'Home', path: '/studentdashboard' },
        { name: 'Fees', path: '/fees' },
        { name: 'Results', path: '/results' },
      ];
    } else if (route.includes('admindashboard')) {
      return [
        { name: 'Dashboard', path: '/admindashboard' },
        { name: 'Manage Fees', path: '/fees' },
        { name: 'Manage Students', path: '/students' },
      ];
    } else if (route.includes('employeedashboard')) {
      return [
        { name: 'Salary', path: '/salary' },
        { name: 'Student', path: '/student' },
      ];
    } else if (route.includes('fees')) {
      return [
        { name: 'home', path: '/admindashboard' }
      ];
    }
    return []; // Return an empty array if no specific route is matched
  }

  logout(): void {
    // Implement your logout logic here
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
    console.log('User logged out');
  }
}