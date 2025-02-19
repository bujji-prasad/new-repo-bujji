import { Component} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


import { ApiService } from '../../api.service';
import { RouterLink } from '@angular/router';
import { SharedDataService } from '../../shared-data.service';


@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink,FormsModule,CommonModule,ButtonModule, TableModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  loginUser = {email : "", password : ""}
  
    errorMessage = ""
    constructor(private router : Router , private apiService : ApiService , private SharedDataService : SharedDataService){}
  
}
