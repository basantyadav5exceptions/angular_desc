import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    const userInfo:any = localStorage.getItem("userInfo");
    const userInfoparse:any = JSON.parse(userInfo);
      if(userInfoparse.token){
        return true;
      }else{
        this.router.navigate([''])
        return false
      }
   }
}
