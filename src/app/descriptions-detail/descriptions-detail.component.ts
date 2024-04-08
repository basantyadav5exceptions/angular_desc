import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthServicesService } from '../service/auth-services.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl  } from '@angular/platform-browser';
import { compileNgModule } from '@angular/compiler';

@Component({
  selector: 'app-descriptions-detail',
  templateUrl: './descriptions-detail.component.html',
  styleUrls: ['./descriptions-detail.component.scss']
})
export class DescriptionsDetailComponent implements OnInit {
  getTopicsData : Array<any> = []
  createCommentData : Array<any> = []
  getCommentData : Array<any> = []
  errorMessage: string = '';
  userDetails : string | null |any;
  userImage :string = '';
  userName : string = ''
  userId : string = ''
  topicId:any;
  isLoading :boolean = false
  @ViewChild('videoPlayer') videoplayer: any;

  commentOnTopicForm = new FormGroup({
    comment_desc: new FormControl(null, Validators.required),
  })

  constructor
  (
    private authService : AuthServicesService,
    private router : Router,
    private activeRoute: ActivatedRoute,
    private toastr : ToastrService,
    private sanitizer: DomSanitizer
  ) { 
   
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.topicId = params['id']; 
    });
  
    this.userDetails = localStorage.getItem('userInfo');
      const userInfo = this.userDetails ? JSON.parse(this.userDetails) : null;
      if(userInfo){
        this.userName = userInfo.data.name;
        this.userImage = userInfo.data.image;
        this.userId = userInfo.data.id;
      }
      
    
    this.getTopicById(this.topicId);
    this.getCommentOnTopic(this.topicId);
  }
  navigateToDescriptionPage(){
    this.router.navigate(['/descriptions'])
  }

  
  createCommentOnTopic(){

    if (this.commentOnTopicForm.invalid) {
      this.commentOnTopicForm.controls['comment_desc'].markAsDirty();
      this.toastr.error("Please given comment");
      return;
    }

    const payload = {
        comment_desc : this.commentOnTopicForm.value.comment_desc,
         user_id : this.userId,
         user_name: this.userName,
         user_image: this.userImage,
         tp_id : this.topicId
    }
    this.authService.createCommentOnTopic(payload).subscribe({
      next: (response) => {
        this.getCommentOnTopic(this.topicId);
        this.commentOnTopicForm.reset()
        this.createCommentData = response
          // this.toastr.success(response.message);
      },
  
      error: (error) => {
         this.toastr.error(error.error.message);
      },
    });
  }

  getCommentOnTopic(topic_id: any) {
    this.isLoading = true;
    this.authService.getCommentOnTopic(topic_id).subscribe({
      next: (response) => {
        this.getCommentData = response.map((comment :any)=> ({
          ...comment,
          user_image: comment.user_image ? `http://localhost:3000/files${comment.user_image.split('files')[1].replace(/\\/g, '/')}` : null, // Modify the image URL
        }));
          this.isLoading = false;
      },
  
      error: (error) => {
        // this.toastr.error(error.error.message);
        this.isLoading = false;
      },
    });
  }

  

  getTopicById(topic_id: any) {
    this.isLoading = true;
    this.authService.getTopicById(topic_id).subscribe({
      next: (response) => {
        // Modify the image and video URLs
        this.getTopicsData = response.map((topic :any)=> ({
          ...topic,
          image: topic.image ? `http://localhost:3000/files${topic.image.split('files')[1].replace(/\\/g, '/')}` : null, // Modify the image URL
          video: topic.video ? `http://localhost:3000/files${topic.video.split('files')[1].replace(/\\/g, '/')}` : null // Modify the video URL
        }));

        this.isLoading = false;
      },

    
      
  
      error: (error) => {
        // Handle error
        this.isLoading = false;
      }
    });
  }
  

  // getSafeImageUrl(url: string): SafeUrl {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }

}
