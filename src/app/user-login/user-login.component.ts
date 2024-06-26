import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServicesService } from '../service/auth-services.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent{

  isLoading:boolean=false
  password: boolean = false;
  cookieValue?:string;

  userLoginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  constructor(
    private router: Router,
    private authService : AuthServicesService,
    private toastr : ToastrService,
    private cookieService : CookieService
    ) {
     }
     

     loginUser() {
      if (this.userLoginForm.invalid) {
        this.userLoginForm.controls['email'].markAsDirty();
        this.userLoginForm.controls['password'].markAsDirty();
        this.toastr.error("Please enter valid email and password");
        return;
      }
      
      const payload = this.userLoginForm.value;
      this.isLoading = true;
      
      this.authService.loginUser(payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          
          const tpLink = this.cookieService.get('tp_link');
          
          if (tpLink) {
            const dynamicUrl = tpLink.replace('http://localhost:4200', '');
            this.router.navigate([dynamicUrl]);
            
          } else {
            this.router.navigate(['/descriptions']);
          }
          
          localStorage.setItem("userInfo", JSON.stringify(response));
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error("Error occurred");
          this.isLoading = false;
        },
      });
    }
    
    
}
