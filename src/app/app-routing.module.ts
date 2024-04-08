import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { DescriptionComponent } from './description/description.component';
import { DescriptionsDetailComponent } from './descriptions-detail/descriptions-detail.component';
import { AuthGuardGuard } from './authData/auth-guard.guard';

const routes: Routes = [
  {path: '', redirectTo: '/user-login', pathMatch: 'full'},
  { path: 'user-login', component: UserLoginComponent },
  { path: 'user-register', component: UserRegistrationComponent },
  { path: 'descriptions', component: DescriptionComponent, canActivate:[AuthGuardGuard] },
  { path: 'descriptions-details/:id', component: DescriptionsDetailComponent, canActivate:[AuthGuardGuard]  },
  // { path: 'add-descriptions', component: AddDescriptionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
