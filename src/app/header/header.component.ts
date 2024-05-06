import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthServicesService } from '../service/auth-services.service';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  imageSelectedFileUrl?: string | ArrayBuffer | null = null;
  userDetails?:string | null
  userImage:string=''
  topicId:any;
  @ViewChild('fileInput') fileInput: any;
  selectedFile?: Blob;
  selectedFileUrl?: string;
  isLoading:boolean = false;
  getEventValue = ''
  getTopics?:string;
  displayStyle?:string;
  displayStyleNotification?:string;
  imageFile:any;
  userId?:number;
  userName?:string;
  searchBarHide:boolean=false
  totalNotification:any;
  hasError: boolean = false;
  errorMessage:string=''
  notAllowed: Array<any> = [
    'descriptions'
  ]

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
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
  ) { 
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urlSegments = this.router.url.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];
        this.searchBarHide = !lastSegment.startsWith('descriptions');
      }
    });
  }


  ngOnInit(): void {

    this.getNotifications();

    this.activeRoute.params.subscribe(params => {
      this.topicId = params['id']; 
    });

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
    const imageFileInput = document.getElementById('videoFileInputValue') as HTMLInputElement;
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
  

  openPopup() {
    this.displayStyle = "block";
  }
  openUserProfile() {
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

    getListOfNotification(){
        this.displayStyleNotification = "block";
    }

    closePopup() {
      this.displayStyle = "none";
    }
    closeNotificationModal() {
      this.displayStyleNotification = "none";
    }

    updateNotifications(topicId:any){
     const payload = {
      noti_tpId : topicId,
      seenTopicBy_userId : this.userId
     }
     this.isLoading = true;
     this.authService.updateNotificationByTopicId(payload).subscribe({
       next: (response) => {
         this.getNotifications();
         this.closePopup();
         this.router.navigate(['/descriptions-details', payload.noti_tpId])
         this.hasError = false;
         this.isLoading = false;
       },
  
       error: (error) => {
         // this.toastr.error(error.error.message);
         this.hasError = true;
         this.isLoading = false;
       },
     });
     
    }


    getNotifications() {
      this.userDetails = localStorage.getItem('userInfo');
      const userInfo = this.userDetails ? JSON.parse(this.userDetails) : null;
      if(userInfo){
        this.userId = userInfo.data.id;
       }
      const seenTopicBy_userId = this.userId
      const tpPoster_userId = this.userId
      this.isLoading = true;
      this.authService.getNotifications(seenTopicBy_userId, tpPoster_userId).subscribe({
        next: (response) => {
          this.totalNotification = response.map((topic: any) => ({
            ...topic,
            image: topic.image ? `http://localhost:3000/files${topic.image.split('files')[1].replace(/\\/g, '/')}` : null
        }));
        this.hasError = false;
            this.isLoading = false;
        },
    
        error: (error) => {
          this.errorMessage = error.error.message;
          this.hasError = true;
          this.isLoading = false;
        },
      });
    }
}




