import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {

  url = 'http://localhost:3000/api';
  getToken :any;
 tittle?: string;

  private selectedTechnologySubject: BehaviorSubject<string> = new BehaviorSubject<string>('Angular');
  private sidebarVisibleSubject = new BehaviorSubject<boolean>(true);

  constructor(
    private http: HttpClient
    ) { }

    
    sidebarVisible$ = this.sidebarVisibleSubject.asObservable();
  
    toggleSidebar() {
      this.sidebarVisibleSubject.next(!this.sidebarVisibleSubject.value);
    }

  
    setSelectedTechnology(technology: string): void {
      this.selectedTechnologySubject.next(technology);
    }
  
    getSelectedTechnology(): BehaviorSubject<string> {
      return this.selectedTechnologySubject;
    }
  
  
    getUserRole(): any {
      this.getToken  = localStorage.getItem("userInfo");
    }

    private tittleSubject = new BehaviorSubject<any>(''); 
    tittle$ = this.tittleSubject.asObservable();

    setTittle(tittle: any) {
      this.tittleSubject.next(tittle); // Method to set the title value
    }
  
    getTittle(): BehaviorSubject<any> {
      return this.tittleSubject; 
    }

    // httpHeaders(): any {
    //   return new HttpHeaders({
    //     'Content-Type': 'application/json; charset=utf-8',
    //     'Authorization': 'Bearer ' + this.getUserRole()
    //   })
    // }
  
    // httpMultipartHeaders(): any {
    //   return new HttpHeaders({
    //     'Authorization': 'Bearer ' + this.getUserRole()
    //   })
    // }

  loginUser(payload:any) : Observable<any>{
    return this.http.post<any>(`${this.url}/login`, payload );
  }
  userRegister(payload:any) : Observable<any>{
    return this.http.post<any>(`${this.url}/register`, payload );
  }

  getAllTopics(technology: string, tittle:string): Observable<any> {
    return this.http.get<any>(`${this.url}/search-topics/${technology}?tittle=${tittle}`);
  }

  getTopicById(topic_id :any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-topics-by-id/${topic_id}`);
  }
  createCommentOnTopic(payload: any): Observable<any> {
    return this.http.post<any>(`${this.url}/create-comment`, payload);
  }
  getCommentOnTopic(topic_id :any): Observable<any> {
    return this.http.get<any>(`${this.url}/comments/${topic_id}`);
  }
  addTopic(payload :any): Observable<any> {
    return this.http.post<any>(`${this.url}/create-topic`, payload);
  }
}
