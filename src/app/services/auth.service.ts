import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private username !: String;
  private userId !: number;
  private tokenCheckInterval: any;

  constructor(private router: Router) { }

  getUsername(): String {
    return this.username;
  }
  setUsername(username: String) {
    this.username = username;
  }

  getUserId(): number {
    return this.userId;
  }
  setUserId(userId: number) {
    this.userId = userId;
  }

  // Start periodic token expiration check
  startTokenExpirationCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }

    this.tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token || this.isTokenExpired(token)) {
        alert('Session expired. Logging out.');
        this.logout();
      }
      console.log('checking for token expiration...');

    }, 300 * 100); // Check every 30 seconds (you can adjust the interval)
  }

  // Stop the token expiration check when user logs out
  stopTokenExpirationCheck() {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  // Check if the token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decoded.exp < currentTime; // True if token is expired
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Assume expired if decoding fails
    }
  }

  // Log the user out
  logout() {
    this.stopTokenExpirationCheck();
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (token) {
      // Assuming your JWT token has a 'role' claim
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    }
    return '';
  }

  getDashboardRoute(): string {
    const role = this.getUserRole();
    switch (role) {
      case 'ROLE_ADMIN':
        return '/admindashboard';
      case 'ROLE_EMPLOYEE':
        return '/employeedashboard';
      case 'ROLE_STUDENT':
        return '/studentdashboard';
      default:
        return '/login';
    }
  }
}
