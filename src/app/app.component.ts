import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthServicesService } from './service/auth-services.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'description-form';
  isLogin: boolean = false; // Assuming initially user is not logged in

  constructor(
    private router: Router,
    public authService : AuthServicesService,

  ) {
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLogin = !this.notAllowed.includes(router.url.split('/')[1]);
      }

    });
  }
  
  notAllowed: Array<any> = [
    '',
    'user-login',
    'user-register',
    // 'descriptions-details'
  ];

}
