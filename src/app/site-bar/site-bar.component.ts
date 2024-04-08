import { Component, OnInit } from '@angular/core';
import { AuthServicesService } from '../service/auth-services.service';

@Component({
  selector: 'app-site-bar',
  templateUrl: './site-bar.component.html',
  styleUrls: ['./site-bar.component.scss']
})
export class SiteBarComponent implements OnInit {

 activeTechnology:any;
  constructor(private authService : AuthServicesService) { }

  ngOnInit(): void {
    this.activeTechnology = 'Angular';
  }

  getTechnology(technology: string): void {
    this.activeTechnology = technology;
    this.authService.setSelectedTechnology(technology);
  }

}
