import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'description-form';
  isLogin: boolean = false; // Assuming initially user is not logged in

  constructor(private router: Router) {
    // Subscribe to router events to detect navigation changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is one of the not allowed routes
        this.isLogin = !this.notAllowed.includes(router.url.split('/')[1]);
      }
    });
  }
  
  notAllowed: Array<any> = [
    '',
    'user-login',
    'user-register',
    'descriptions-details',
    'add-descriptions'
  ];

}
