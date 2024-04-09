import { Component, OnInit } from '@angular/core';
import { AuthServicesService } from '../service/auth-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-bar',
  templateUrl: './site-bar.component.html',
  styleUrls: ['./site-bar.component.scss']
})
export class SiteBarComponent implements OnInit {
  userDetails:any;
  userImage:any;
 activeTechnology:any;
  constructor(
    private authService : AuthServicesService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.activeTechnology = 'Angular';

    this.userDetails = localStorage.getItem('userInfo');
      const userInfo = this.userDetails ? JSON.parse(this.userDetails) : null;
      if(userInfo){
        this.userImage = userInfo.data.image;
      }
      
  }

  getTechnology(technology: string): void {
    this.activeTechnology = technology;
    this.authService.setSelectedTechnology(technology);
  }

  logout(){
    localStorage.removeItem('userInfo');
    this.router.navigate(['/user-login'])
  }

}
