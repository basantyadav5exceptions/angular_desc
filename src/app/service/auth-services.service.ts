import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {

  url = 'http://localhost:3000/api';
  getToken :any;

  private selectedTechnologySubject: BehaviorSubject<string> = new BehaviorSubject<string>('Angular');

  constructor(
    private http: HttpClient
    ) { }

  
    setSelectedTechnology(technology: string): void {
      this.selectedTechnologySubject.next(technology);
    }
  
    getSelectedTechnology(): BehaviorSubject<string> {
      return this.selectedTechnologySubject;
    }
  
  
    getUserRole(): any {
      this.getToken  = localStorage.getItem("userInfo");
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

  getAllTopics(technology: string): Observable<any> {
    return this.http.get<any>(`${this.url}/topics/${technology}`);
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
