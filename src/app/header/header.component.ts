import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthServicesService } from '../service/auth-services.service';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  imageSelectedFileUrl?: string | ArrayBuffer | null = null;
  userDetails?:string | null
  userImage:string=''
  @ViewChild('fileInput') fileInput: any;
  selectedFile?: Blob;
  selectedFileUrl?: string;
  isLoading:boolean = false;
  getEventValue = ''
  getTopics:any;
  displayStyle:any;
  imageFile:any;
  userId?:number;
  userName?:string;
  searchBarHide:boolean=false

  searchTopicByTittleForm = new FormGroup({
    tittle: new FormControl('')
  })

  updateUserProfileForm = new UntypedFormGroup({
    name: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
  })

  constructor(
    private router : Router,
    private authService : AuthServicesService,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) { 
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.searchBarHide = this.notAllowed.includes(router.url.split('/')[1]);
      }
    });
  }

  notAllowed: Array<any> = [
    'descriptions'
  ]

  ngOnInit(): void {

    this.userDetails = localStorage.getItem('userInfo');
    const userInfo = this.userDetails ? JSON.parse(this.userDetails) : null;
    if(userInfo){
      this.userImage = userInfo.data.image;
      this.userId = userInfo.data.id;
      this.userName = userInfo.data.name;
    }

    this.updateUserProfileForm.patchValue({
      name: this.userName,
      image:this.userImage
    });

   

  }

 


  onSelectImageClick() {
    const imageFileInput = document.getElementById('imageFileInput') as HTMLInputElement;
    if (imageFileInput) {
      imageFileInput.click();
    }
  }
  

  onFileSelectedImage(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSelectedFileUrl = reader.result;
        this.updateUserProfileForm.patchValue({
          image: file
        });
      };
    }
  }

  updateUserProfile(){
    const userId = this.userId;
    const formData = new FormData();
    this.imageFile = this.updateUserProfileForm.get('image')?.value as Blob | string;
    formData.append('image', this.imageFile);
    formData.append('name', this.updateUserProfileForm.value.name as string);
  
    this.authService.updateUserProfile(formData, userId).subscribe({
      next: (response) => {
        // Update localStorage data
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        userInfo.data.name = formData.get('name') as string;
        userInfo.data.image = response.data.image; 
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
  
        this.userImage = response.data.image;
        this.userName = response.data.name;
  
        this.toastr.success(response.message);
        this.closePopup();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        this.isLoading = false;
      },
    });
  }
  
  

  closePopup() {
    this.displayStyle = "none";
  }

  openPopup() {
    this.displayStyle = "block";
  }
  
  openFileInput() {
    this.fileInput.nativeElement.click();
  }


  logoutUser(){
    this.cookieService.delete('tp_link');
    localStorage.removeItem('userInfo');
    this.router.navigate(['/user-login']);
  }

  searchTopicByTittle() {
    const tittle : any = this.searchTopicByTittleForm.value.tittle;
    this.authService.setTittle(tittle);
    };
}




