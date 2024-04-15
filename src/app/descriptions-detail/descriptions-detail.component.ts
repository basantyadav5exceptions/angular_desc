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
  getReplyOfCommentsData : Array<any> = []
  getLikeList : Array<any> = []
  likeUnlikeData : Array<any> = []
  getAnswerList : any;
  showHideCommentSection:boolean = false
  isLiked:boolean = false
  createCommentData : Array<any> = []
  getAnswerData : Array<any> = []
  getCommentData : Array<any> = []
  errorMessage: string = '';
  userDetails : string | null |any;
  userImage :string = '';
  userName : string = ''
  userId : string = ''
  topicId:any;
  isLoading :boolean = false
  displayTech:string=''
  @ViewChild('videoPlayer') videoplayer: any;
  totalCommentAndReply ?: number

  showHideTextInput: number | null = null;

  commentOnTopicForm = new FormGroup({
    comment_desc: new FormControl(null, Validators.required),
  })

  answerOfComment = new FormGroup({
    answer_desc : new FormControl(null, Validators.required)
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
     
    this.authService.getSelectedTechnology().subscribe(technology => {
       this.displayTech = technology
    });

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
    this.getLikeUnlikeOnTopic(this.topicId);
    this.getReplyOnComment()
  }
  navigateToDescriptionPage(){
    this.router.navigate(['/descriptions'])
  }

  toggleTextArea(id: number) {
    this.showHideTextInput = this.showHideTextInput === id ? null : id;
  }

  toggleCommentSection() {
    this.showHideCommentSection = !this.showHideCommentSection;
  }

  createUpdatelikeUnlike(){

    const payload = {
      user_id: this.userId,
      tp_id: this.topicId
    }
    this.authService.createUpdatelikeUnlike(payload).subscribe({
      next: (response) => {
        this.likeUnlikeData = response;
        this.isLiked = !this.isLiked;
        this.getLikeUnlikeOnTopic(this.topicId);
      },
  
      error: (error) => {
         this.toastr.error(error.error.message);
      },
    });
  }

  getLikeUnlikeOnTopic(topic_id: any) {
    this.isLoading = true;
    this.authService.getLikeUnlikeOnTopic(topic_id).subscribe({
      next: (response) => {
        this.getLikeList = response
          this.isLoading = false;
      },
  
      error: (error) => {
        // this.toastr.error(error.error.message);
        this.isLoading = false;
      },
    });
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

  createReplyOnCommets(comment_id : number){
    if (this.answerOfComment.invalid) {
      this.answerOfComment.controls['answer_desc'].markAsDirty();
      this.toastr.error("Please given answer");
      return;
    }
    const payload = {
         comment_id : comment_id,
         answer_desc : this.answerOfComment.value.answer_desc,
         user_id : this.userId,
    }
    this.authService.createReplyOnCommets(payload).subscribe({
      next: (response) => {
        this.getReplyOnComment();
        this.answerOfComment.reset()
        this.getAnswerData = response;
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

        this.getReplyOfCommentsData = this.getCommentData.flatMap(answerData => {
          return answerData.answer_data.map((ele:number) => ele);
      });
         this.totalCommentAndReply = this.getCommentData.length + this.getReplyOfCommentsData.length
          this.isLoading = false;
      },
  
      error: (error) => {
        // this.toastr.error(error.error.message);
        this.isLoading = false;
      },
    });
  }

  getReplyOnComment() {
    this.isLoading = true;
    this.authService.getReplyOnComment().subscribe({
      next: (response) => {
        this.getAnswerList = response
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
  
  toggleVideo() {
    this.videoplayer.play();
}
 

}
