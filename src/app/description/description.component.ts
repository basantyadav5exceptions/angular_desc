import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServicesService } from '../service/auth-services.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  @ViewChild('imageFileInput') imageFileInput!: ElementRef;
  @ViewChild('videoFileInput') vedioFileInput!: ElementRef;

  notFoundAnyTopic :string = '';
  getTopics: Array<any> = []
  errorMessage : string = ''
  isLoading: boolean = false;
  TopicId:any
  displayStyle:any;
 
  selectedFile?: any;
  videoSelectedFileUrl: string | ArrayBuffer | null = null;
  imageSelectedFileUrl?: string | ArrayBuffer | null = null;
  userDetails :any
  userId:any;
  imageFile: any | Blob | string
  videoFile: any | Blob | string

  addMoreTopicForm = new UntypedFormGroup({
    category: new FormControl('', Validators.required),
    tittle: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    video: new FormControl('', Validators.required),
    user_id: new FormControl('', Validators.required),
  })

  constructor(
    private  route : Router ,
    private authService : AuthServicesService,
    private toastr : ToastrService,
    ) { }

    ngOnInit(): void {
 
      this.userDetails = localStorage.getItem('userInfo');
      const userInfo = this.userDetails ? JSON.parse(this.userDetails) : null;
      if(userInfo){
        this.userId = userInfo.data.id;
      }

      this.authService.getSelectedTechnology().subscribe(technology => {
        if (technology) {
          this.getAllTopics(technology);
        }
      });
    }

    onSelectImageClick() {
      const imageFileInput = document.getElementById('imageFileInput') as HTMLInputElement;
      if (imageFileInput) {
        imageFileInput.click();
      }
    }
    onSelectVideoClick() {
      const videoFileInput = document.getElementById('videoFileInput') as HTMLInputElement;
      if (videoFileInput) {
        videoFileInput.click();
      }
    }
  
    onFileSelectedVideo(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        // this.addMoreTopicForm.controls['video'].setValue(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.videoSelectedFileUrl = reader.result;
          this.addMoreTopicForm.patchValue({
            video: file
          });
        };
      }
    }

    onFileSelectedImage(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageSelectedFileUrl = reader.result;
          this.addMoreTopicForm.patchValue({
            image: file
          });
        };
      }
    }

    openPopup() {
      this.displayStyle = "block";
    }
    closePopup() {
      this.displayStyle = "none";
    }


    addTopic() {
      this.isLoading = true;
      const payload = this.addMoreTopicForm.value;
      
      const formData: FormData = new FormData();
    
      this.imageFile = this.addMoreTopicForm.get('image')?.value as Blob | string;
      formData.append('image', this.imageFile);
     
      this.videoFile = this.addMoreTopicForm.get('video')?.value as Blob | string;
      formData.append('video', this.videoFile);
    
      formData.append('category', payload.category as string);
      formData.append('tittle', payload.tittle as string);
      formData.append('description', payload.description as string);
      formData.append('user_id', this.userId as string);

      this.authService.addTopic(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.closePopup();

          this.authService.getSelectedTechnology().subscribe(technology => {
            if (technology) {
              this.getAllTopics(technology);
            }
          });
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          this.isLoading = false;
        },
      });
    }
    
    


  getAllTopics(technology: string){
    this.isLoading = true;
    this.authService.getAllTopics(technology).subscribe({
      next: (response) => {
        this.getTopics = response
          // this.toastr.success(response.message);
          this.isLoading = false;
      },
  
      error: (error) => {
         this.errorMessage = error.error.message;
        this.isLoading = false;
      },
    });
  }

}
