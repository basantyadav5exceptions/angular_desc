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
  private tittleSubject = new BehaviorSubject<any>(''); 
 

  constructor(
    private http: HttpClient
    ) { }

    
    sidebarVisible$ = this.sidebarVisibleSubject.asObservable();
    tittle$ = this.tittleSubject.asObservable();
  
    toggleSidebar() {
      this.sidebarVisibleSubject.next(!this.sidebarVisibleSubject.value);
    }

    getUserToken(): string | null {
      const userInfoString = localStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        return userInfo.token;
      } else {
        return null;
      }
      
    }
    

    setSelectedTechnology(technology: string): void {
      this.selectedTechnologySubject.next(technology);
    }
  
    getSelectedTechnology(): BehaviorSubject<string> {
      return this.selectedTechnologySubject;
    }

    getTittle(): BehaviorSubject<any> {
      return this.tittleSubject; 
    }

    setTittle(tittle: any) {
      this.tittleSubject.next(tittle); // Method to set the title value
    }
  
  

    httpHeaders(): any {
      return new HttpHeaders({
        'Authorization': 'Bearer ' + this.getUserToken()
      })
    }
  

  loginUser(payload:any) : Observable<any>{
    return this.http.post<any>(`${this.url}/login`, payload );
  }
  userRegister(payload:any) : Observable<any>{
    return this.http.post<any>(`${this.url}/register`, payload );
  }

  getAllTopics(technology: string, tittle: string): Observable<any> {
    return this.http.get<any>(`${this.url}/search-topics/${technology}?tittle=${tittle}`, {
      headers: this.httpHeaders() 
    });
  }
  

  getTopicById(topic_id :any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-topics-by-id/${topic_id}`, {headers: this.httpHeaders()});
  }
  createCommentOnTopic(payload: any): Observable<any> {
    return this.http.post<any>(`${this.url}/create-comment`, payload);
  }
  createReplyOnCommets(payload: any): Observable<any> {
    return this.http.post<any>(`${this.url}/reply-of-comment`, payload);
  }
  getCommentOnTopic(topic_id :any): Observable<any> {
    return this.http.get<any>(`${this.url}/comments/${topic_id}`);
  }
  getListOfUserEmail(): Observable<any> {
    return this.http.get<any>(`${this.url}/get-user-email`);
  }
  addTopic(payload :any): Observable<any> {
    return this.http.post<any>(`${this.url}/create-topic`, payload);
  }
  createUpdatelikeUnlike(payload :any): Observable<any> {
    return this.http.post<any>(`${this.url}/like-unlike-topic`, payload);
  }
  getLikeUnlikeOnTopic(topic_id :any): Observable<any> {
    return this.http.get<any>(`${this.url}/get-like-on-topic/${topic_id}`);
  }
}
