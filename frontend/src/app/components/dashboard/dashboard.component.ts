import { Component, OnInit , CUSTOM_ELEMENTS_SCHEMA ,DoCheck } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../../shared-data.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksComponent } from '../tasks/tasks.component';
import { UpdateTaskComponent } from '../update-task/update-task.component';
import { HomeComponent } from '../home/home.component';
import { state } from '@angular/animations';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
   imports: [HomeComponent,UpdateTaskComponent,AddTaskComponent,CommonModule,SidebarModule,TasksComponent,ButtonModule, AvatarModule, TableModule, AvatarGroupModule, MenuModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit,DoCheck {
  title = 'ehr-demo';
  userEmail = "bujji@gmail.com"
  items = [
    {
      items: [
        {
          label: this.userEmail,
          disabled : true,
        },
        {
          label: 'Logout',
          icon : 'pi pi-sign-out',
          command : () => this.logout(),
          styleClass : 'logout-button'
        }
      ]
    }
  ];

  logout(){
    localStorage.removeItem("jwtToken");
    sessionStorage.removeItem("jwtToken");
    this.router.navigate(['/'])
  }
    products = [
      {
        code: "f230fh0g3",
        name: "Bamboo Watch",
        category: "Accessories",
        quantity: 10
      },
      {
        code: "nvklal433",
        name: "Black Watch",
        category: "Accessories",
        quantity: 61
      },
      {
        code: "zz21cz3c1",
        name: "Blue Band",
        category: "Fitness",
        quantity: 1
      },
      {
        code: "244wgerg2",
        name: "Blue T-Shirt",
        category: "Clothing",
        quantity: 25
      },
      {
        code: "h456wer53",
        name: "Bracelet",
        category: "Accessories",
        quantity: 73
      },
    ]
    customers = [
      {
        name: "customers",
        country: "US",
        representative: "TEST",
        status: true
      }
    ];
    representatives = [{ label: "edvak", name: "edvak" }];
    value = "";
    ingredient: any = '';
    visible = false
    isSidebarVisible = false;
    isTasksVisible = false;
    isCreateTaskFromVisible = false;
    isUpdateTaskOpen = false;
    isHomePageOpen = true;
    profileLable = "";
    constructor(private primeng: PrimeNG , private SharedDataService : SharedDataService, private router : Router , private ApiService : ApiService) { }
  
    ngOnInit(): void {
      this.primeng.ripple.set(true);
      this.checkTokenExpiration();
      setInterval(() => {
        this.checkTokenExpiration();
      },1000)
      this.SharedDataService.isUpdateTaskOpen$.subscribe((state) => {
        this.isUpdateTaskOpen = state;
      })
      this.SharedDataService.isCreateTaskFromVisible$.subscribe((state) => {
        this.isCreateTaskFromVisible = state;
      })
      this.SharedDataService.isTasksVisible$.subscribe((state) => {
        this.isTasksVisible = state;
      })
      this.SharedDataService.userFirstName$.subscribe((firstName) => {
        if(firstName){
          this.profileLable = firstName.charAt(0).toUpperCase()
        }
      })
      this.SharedDataService.isHomePageVisible$.subscribe((state) =>{
        this.isHomePageOpen = state;
      })
      this.SharedDataService.isSidebarVisible$.subscribe((state) => {
        this.isSidebarVisible = state;
      })
      this.ApiService.getLoginUser().subscribe((response) => {
        console.log(`login user details : ${response.email}`)
        this.userEmail = response.email
        this.items = [
          {
            items: [
              {
                label: this.userEmail, // Dynamically set the user email
                disabled: true,
              },
              {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => this.logout(),
                styleClass: 'logout-button',
              }
            ]
          }
        ];
      } , (error) => {
        console.log("errro while getting the login user details")
      })
    }

    ngDoCheck() {
      // Regularly check token expiration
      this.checkTokenExpiration();
    }

  checkTokenExpiration() {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      const decodedToken = jwtDecode(token); 
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        localStorage.removeItem('jwtToken');
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  
    toggleUpdateTaskState() {
      this.SharedDataService.setUpdateTaskState(!this.isUpdateTaskOpen);  
      this.resetOtherStates("update")
    }
  
    toggleCreateTaskState() {
      this.SharedDataService.setCreateTaskState(!this.isCreateTaskFromVisible); 
      this.resetOtherStates("create")
    }
  
    toggleViewTaskState() {
      this.SharedDataService.setTasksVisibleState(!this.isTasksVisible); 
      this.resetOtherStates("view")
    }

    toggleHomePageState(){
      this.SharedDataService.setHomePageVisibility(!this.isHomePageOpen);
      this.resetOtherStates("home")
    }

    toggleSidebar(){
      this.SharedDataService.setSidebarVisibility(!this.isSidebarVisible)
    }
  
     // Toggle sidebar visibility
     onClickSidebar() {
      this.toggleSidebar()
    }
  
    toggleDarkMode() {
      const element = document.querySelector('html');
      element && element.classList.toggle('dark-theme');
    }
  
    showTasks() {
      if(this.isTasksVisible){
        this.SharedDataService.setTasksVisibleState(false)
      }
      this.toggleViewTaskState()
    }
  
  
    showCreateTasks(){
      this.toggleCreateTaskState()
    }

    showHomePage(){
      this.toggleHomePageState()
    }
  
  
    resetOtherStates(action: string) {
      if (action === 'create') {
        this.SharedDataService.setUpdateTaskState(false);
        this.SharedDataService.setTasksVisibleState(false); 
        this.SharedDataService.setHomePageVisibility(false);
        this.SharedDataService.setSidebarVisibility(false);
      } else if (action === 'view') {
        this.SharedDataService.setCreateTaskState(false); 
        this.SharedDataService.setUpdateTaskState(false); 
        this.SharedDataService.setHomePageVisibility(false);
        this.SharedDataService.setSidebarVisibility(false);
      } else if (action === 'update') {
        this.SharedDataService.setCreateTaskState(false); 
        this.SharedDataService.setTasksVisibleState(false);
        this.SharedDataService.setHomePageVisibility(false);
        this.SharedDataService.setSidebarVisibility(false);
      } else if(action === "home"){
        this.SharedDataService.setCreateTaskState(false); 
        this.SharedDataService.setTasksVisibleState(false);
        this.SharedDataService.setUpdateTaskState(false);
        this.SharedDataService.setHomePageVisibility(true);
        this.SharedDataService.setSidebarVisibility(false)
      }
    }
}
