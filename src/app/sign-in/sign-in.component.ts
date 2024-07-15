import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Correct path to AuthService

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent {
  loginError = false; // for error popup purpose 

  constructor(
    private authService: AuthService,
    private router: Router
  ) {} 

  login(username: string, password: string): void {
    this.authService.login(username, password)
      .subscribe(
        (response: any) => {
          console.log('Login response:', response);
          const token = response; 
          if (token) {
            localStorage.setItem('token', token);
            console.log('Token:', token);
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Token not found in response:', response);
            this.loginError = true;
          }
        },
        error => {
          console.error('Login failed:', error);
          this.loginError = true;
        }
      );
  }
  
}
