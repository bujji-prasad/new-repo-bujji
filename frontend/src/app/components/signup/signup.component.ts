import { Component, OnInit , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


import { ApiService } from '../../api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterLink,FormsModule,CommonModule,ButtonModule, InputTextModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  user = {first_name : "" , last_name : "" , email : "", password : ""}
  constructor(private router : Router , private apiService : ApiService) {}
  errorMessage : String = "";
  successMessage : String = "";
  isFormValid = true;

  onSignup(){
    this.isFormValid = this.validateForm();
    if(!this.isFormValid){
      return;
    }
    this.apiService.addUserApi(this.user).subscribe((response) => {
      console.log("user added successfully");
      this.errorMessage = "";
      this.successMessage = "User registered successfully!";
      this.user = {first_name :  "" , last_name : "" , email : "" , password : ""}
      this.router.navigate(['/'])
    }, (error) => {
      if (error.status === 400 && error.error.message === "Email already exists") {
        this.errorMessage = 'The email address is already registered. Please use a different one.';
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
    })
  }

  validateForm (){
    const {first_name,last_name,email,password} = this.user
    if(!first_name || !last_name || !email || !password){
      this.errorMessage = "All field are required";
      return false;
    }

    const namePattern = /^[A-Za-z]+$/;
    if (!namePattern.test(this.user.first_name)) {
      this.errorMessage = "First name must start with an alphabet and contain only letters.";
      return false;
    }
    if (!namePattern.test(this.user.last_name)) {
      this.errorMessage = "Last name must start with an alphabet and contain only letters.";
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if(!emailRegex.test(email)){
      this.errorMessage = "Plase enter a valid email"
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if(!passwordRegex.test(password)){
      this.errorMessage = "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.";
      return false;
    }

    return true;
  }
}
