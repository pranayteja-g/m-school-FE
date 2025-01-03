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
  userRole: string = ''; // Holds the user role

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title, private authService: AuthService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
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

  private getHomeRoute(): string {
    return this.authService.getDashboardRoute();
  }

  // Map route to a user-friendly page name
  private getPageName(route: string): string {
    if (route.includes('studentdashboard')) {
      return 'Student Dashboard';
    } else if (route.includes('admindashboard')) {
      return 'Admin Dashboard';
    } else if (route.includes('employeedashboard')) {
      return 'Employee Dashboard';
    } else if (route.includes('m-employee')) {
      return 'Manage Employee';
    }
    return 'Unknown Page'; // Default if no match
  }

  // Map route to corresponding navigation links
  private getNavLinks(route: string): { name: string, path: string }[] {
    // Common pages that need dynamic home routing
    const commonPages = ['m-results', 'm-fees', 'm-salary', 'm-employee'];

    if (commonPages.some(page => route.includes(page))) {
      return [
        { name: 'Home', path: this.getHomeRoute() }
      ];
    }

    // Rest of your existing conditions...
    if (route.includes('studentdashboard')) {
      return [
        { name: 'Home', path: '/studentdashboard' },
        { name: 'Fees', path: '/m-fees' },
        { name: 'Results', path: '/m-results' },
      ];
    } else if (route.includes('admindashboard')) {
      return [
        { name: 'Dashboard', path: '/admindashboard' },
        { name: 'Manage Fees', path: '/m-fees' },
        { name: 'Manage Students', path: '/m-student' },
        { name: 'Manage Results', path: '/m-results' },
        { name: 'Manage Employees', path: '/m-employee' },
      ];
    } else if (route.includes('employeedashboard')) {
      return [
        { name: 'Home', path: '/employeedashboard' },
        { name: 'Results', path: '/m-results' },
        // { name: 'salary', path: '/m-salary' },
      ];
    }

    return [];
  }

  logout(): void {
    // Implement your logout logic here
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
    console.log('User logged out');
  }
}