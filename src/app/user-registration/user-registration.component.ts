import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServicesService } from '../service/auth-services.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  @ViewChild('imageFileInput') imageFileInput!: ElementRef;

  imageSelectedFileUrl?: string | ArrayBuffer | null = null;
  selectedFile?: Blob;
  selectedFileUrl?: string;
  isLoading:boolean = false;
  imageFile:any;

  registrationForm = new UntypedFormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
  })
  
  constructor(
    private router: Router,
    private authService : AuthServicesService,
    private toastr : ToastrService
    ) { }

  ngOnInit(): void {
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
        this.registrationForm.patchValue({
          image: file
        });
      };
    }
  }
  
  

  userRegister() {
    if (this.registrationForm.invalid) {
      this.registrationForm.controls['name'].markAsDirty();
      this.registrationForm.controls['email'].markAsDirty();
      this.registrationForm.controls['password'].markAsDirty();
      this.toastr.error("Please enter all fields");
      return;
    }
    this.isLoading = true;
  
  
    // Create a FormData object and append data to it
    const formData = new FormData();

    this.imageFile = this.registrationForm.get('image')?.value as Blob | string;
    formData.append('image', this.imageFile);

      formData.append('name', this.registrationForm.value.name as string);
      formData.append('email', this.registrationForm.value.email as string);
      formData.append('password', this.registrationForm.value.password as string);
    
      
    // Call the authService method to register the user
    this.authService.userRegister(formData).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.router.navigate(['/descriptions']);
        localStorage.setItem("userInfo", JSON.stringify(response));
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error("error occurs");
        this.isLoading = false;
      },
    });
  }
  



}


