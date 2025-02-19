import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [{
    path : "",
    pathMatch : "full",
    loadComponent : () => import("../app/components/login/login.component").then(
        m => m.LoginComponent
    )
},
{
    path : "dashboard",
    loadComponent : () => import("../app/components/dashboard/dashboard.component").then(
       m => m.DashboardComponent 
    ),
    canActivate : [authGuard]
},
{
    path : "signup",
    loadComponent : () => import("../app/components/signup/signup.component").then(
       m => m.SignupComponent 
    ),
},
{
    path : "forgotpassword",
    loadComponent : () => import("../app/components/forgot-password/forgot-password.component").then(
       m => m.ForgotPasswordComponent 
    ),
}];
