import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-descriptions',
  templateUrl: './add-descriptions.component.html',
  styleUrls: ['./add-descriptions.component.scss']
})
export class AddDescriptionsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  selectedFile?: Blob;
  selectedFileUrl?: string;
  isLoading:boolean = false;
  constructor() { }

  ngOnInit(): void {
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


}
