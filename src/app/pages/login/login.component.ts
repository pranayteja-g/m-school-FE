import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObject: login;

  constructor(private http: HttpClient, private router: Router, public authService: AuthService) {
    this.loginObject = new login('', '');
  }

  onLogin() {
    this.http.post('http://localhost:8080/auth/login', this.loginObject, { responseType: 'text' })
      .subscribe((res: any) => {
        console.log('JWT token: ', res);
        alert('Login successful!');
        localStorage.removeItem('token');
        localStorage.setItem('token', res);

        this.authService.startTokenExpirationCheck(); // Start checking token expiration
        console.log('in logged in, checking for token expiration...');
        

        const role = this.getRoleFromToken(res);

        if (role === 'ROLE_ADMIN') {
          this.router.navigateByUrl('/admindashboard');
        } else if (role === 'ROLE_STUDENT') {
          this.router.navigateByUrl('/studentdashboard');
        } else if (role === 'ROLE_EMPLOYEE') {
          this.router.navigateByUrl('/employeedashboard');
        } else {
          this.router.navigateByUrl('/forbidden');
        }

      }, (error) => {
        console.error('Error logging in: ', error);
        alert('Error logging in. Please try again.');
      }

      );
  }

  getRoleFromToken(token: string): string {
    try {
      // Decode the token, and handle the case if the token is malformed
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded JWT:', decodedToken);

      const userRole = decodedToken.role; // Extract the role
      console.log('User Role:', userRole);

      return userRole || ''; // Return the role, or empty string if not found
    } catch (e) {
      console.error('Invalid token:', e);
      return ''; // Return an empty string if there's an issue decoding the token
    }
  }


}
export class login {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}