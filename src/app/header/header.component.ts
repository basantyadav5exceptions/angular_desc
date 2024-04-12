import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServicesService } from '../service/auth-services.service';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userDetails?:string | null
  userImage:string=''
  @ViewChild('fileInput') fileInput: any;
  selectedFile?: Blob;
  selectedFileUrl?: string;
  isLoading:boolean = false;
  getEventValue = ''
  getTopics:any;

  searchTopicByTittleForm = new FormGroup({
    tittle: new FormControl('')
  })

  constructor(
    private router : Router,
    private authService : AuthServicesService
  ) { }

  ngOnInit(): void {

    this.userDetails = localStorage.getItem('userInfo');
    const userInfo = this.userDetails ? JSON.parse(this.userDetails) : null;
    if(userInfo){
      this.userImage = userInfo.data.image;
    }

  }
  
  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file.name;
    } 
  }
  
  displaySelectedImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  toggleSidebar() {
    this.authService.toggleSidebar();
  }

  logoutUser(){
    localStorage.removeItem('userInfo');
    this.router.navigate(['/user-login'])
  }

  searchTopicByTittle() {
    const tittle : any = this.searchTopicByTittleForm.value.tittle;
    this.authService.setTittle(tittle);
    };
}




