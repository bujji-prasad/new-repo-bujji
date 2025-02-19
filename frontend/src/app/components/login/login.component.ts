import { Component} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';


import { ApiService } from '../../api.service';
import { RouterLink } from '@angular/router';
import { SharedDataService } from '../../shared-data.service';


@Component({
  selector: 'app-login',
  imports: [RouterModule,RouterLink,FormsModule,CommonModule,ButtonModule, TableModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginUser = {email : "", password : ""}

  errorMessage = ""
  constructor(private router : Router , private apiService : ApiService , private SharedDataService : SharedDataService){}

  onSignin(){
    if(!this.loginUser.email || !this.loginUser.password){
      this.errorMessage = "both email and password are required";
      return 
    }
    else{
      this.apiService.loginUserApi(this.loginUser).subscribe((response) => {
        console.log(response.message)
        console.log(response.user.first_name)
        this.SharedDataService.setUserFirstName(response.user.first_name)
        localStorage.setItem("jwtToken" , response.token)
        this.router.navigate(["/dashboard"])
      } , (error) => {
        if(error.status === 400){
          this.errorMessage =  error.error.message || "Invalid credentials";
        }
        else {
          console.log(error)
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      })
    }
  }
}
