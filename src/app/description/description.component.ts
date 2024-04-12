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
  getTittle? : any
  getTechnology: any;
 
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
        this.getTechnology = technology
      });

     this.authService.getTittle().subscribe(tittle =>{
      this.getTittle = tittle;
      this.getAllTopics(this.getTechnology, this.getTittle)
     })

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
      // if (this.addMoreTopicForm.invalid) {
      //   this.addMoreTopicForm.controls['category'].markAsDirty();
      //   this.addMoreTopicForm.controls['tittle'].markAsDirty();
      //   this.addMoreTopicForm.controls['description'].markAsDirty();
      //   this.toastr.error("Please enter all fields");
      //   return;
      // }
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
          this.toastr.success(response.message)
          this.isLoading = false;
          this.addMoreTopicForm.reset();
          this.closePopup();

          this.authService.getTittle().subscribe(tittle =>{
            this.getTittle = tittle;
            this.getAllTopics(this.getTechnology, this.getTittle)
           })
           
        },
        error: (error) => {
          this.toastr.error(error.error.message)
          this.isLoading = false;
        },
      });
    }
    
 
  


    getAllTopics(tittle: string, technology:string) {
      this.isLoading = true;
      this.authService.getAllTopics(tittle, technology).subscribe({
          next: (response) => {
              this.getTopics = response.map((topic: any) => ({
                  ...topic,
                  image: topic.image ? `http://localhost:3000/files${topic.image.split('files')[1].replace(/\\/g, '/')}` : null,
                  video: topic.video ? `http://localhost:3000/files${topic.video.split('files')[1].replace(/\\/g, '/')}` : null,
              }));
              this.isLoading = false;
          },
  
          error: (error) => {
              this.errorMessage = error.error.message;
              this.isLoading = false;
          },
      });
  }


  


}
