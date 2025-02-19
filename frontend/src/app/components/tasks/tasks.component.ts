

import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { Component, OnInit , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { ApiService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';


import { SharedDataService } from '../../shared-data.service';
import { ThemeService } from '@primeng/themes';



@Component({
  selector: 'app-tasks',
 imports: [DialogModule,DropdownModule,CommonModule,ButtonModule, DatePickerModule,CardModule, TableModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, DrawerModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TasksComponent implements OnInit{
  title = 'ehr-demo';
  items = [
    {
      label: 'Options',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh'
        },
        {
          label: 'Export',
          icon: 'pi pi-upload'
        }
      ]
    }
  ];
  tasks: any[] = [];
  customers = [
    {
      name: "customers",
      country: "US",
      representative: "TEST",
      status: true
    }
  ];
  priorities = ["Low" , "Medium" , "High"]
  users = ["bujji" , "prasad" , "aruna" , "siri"]
  status = ["Completed" , "In-progress" , "Pending"]
  representatives = [{ label: "edvak", name: "edvak" }];
  idToUpdateTask = "";
  isTasksVisible = false;
  isCreateTaskFromVisible = false;
  isUpdateTaskOpen = false;
  deletedTasks: any[] = [];
  isDelete: boolean = false;
  idToDeleteTask: String = '';
  first: number = 0; // Keep track of the current page index
  rows: number = 10; 
  totalRecords: number = 0;

  statusOptions = [
    { label: 'Completed', value: 'Completed' },
    { label: 'In-progress', value: 'In-progress' },
    { label: 'Pending', value: 'Pending' }
  ];
  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ];
  selectedStatus: string = '';
  selectedPriority: string = '';
  constructor(private primeng: PrimeNG , private apiService : ApiService , private SharedDataService : SharedDataService) { }


  ngOnInit(): void {
    this.primeng.ripple.set(true);
    const deletedTasksFromStorage = JSON.parse(localStorage.getItem('deletedTasks') || '[]');
    this.deletedTasks = deletedTasksFromStorage;
    this.getTasks();
    this.SharedDataService.isDelete$.subscribe((isDelete) => {
      this.isDelete = isDelete; // Update local state when shared service changes
    });
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element && element.classList.toggle('dark-theme');
  }

  filterTasks() {
    console.log("inside the filterd tasks")
    this.tasks =  this.tasks.filter(task => {
      const statusMatch = this.selectedStatus ? task.status === this.selectedStatus : true;
      const priorityMatch = this.selectedPriority ? task.priority === this.selectedPriority : true;
      return statusMatch && priorityMatch;
    });
  }

  getTasks() {
    this.apiService.getTasksApi().subscribe(
      (response) => {
        this.tasks = response.tasks;
        this.tasks = this.tasks.filter(task => !this.deletedTasks.some(deletedTask => deletedTask._id === task._id));
        this.filterTasks()
        this.totalRecords = this.tasks.length; 
        this.updatePagination();
      },
      (error) => {
        console.log('Error fetching tasks:', error);
      }
    );
  }

  onStatusFilterChange(event: any) {
    this.selectedStatus = event.value;
    this.filterTasks();
  }

  onPriorityFilterChange(event: any) {
    this.selectedPriority = event.value;
    this.filterTasks();
  }

  

  resetOtherStates(action: string) {
    if (action === 'create') {
      this.SharedDataService.setUpdateTaskState(false);
      this.SharedDataService.setTasksVisibleState(false); 
    } else if (action === 'view') {
      this.SharedDataService.setCreateTaskState(false); 
      this.SharedDataService.setUpdateTaskState(false); 
    } else if (action === 'update') {
      this.SharedDataService.setCreateTaskState(false); 
      this.SharedDataService.setTasksVisibleState(false);
    }
  }

  toggleUpdateTaskState() {
    this.SharedDataService.setUpdateTaskState(!this.isUpdateTaskOpen);  
    this.resetOtherStates("update");
  }
  

  toggleCreateTaskState() {
    this.SharedDataService.setCreateTaskState(!this.isCreateTaskFromVisible); 
    this.resetOtherStates("create")
  }

  toggleViewTaskState() {
    this.SharedDataService.setTasksVisibleState(!this.isTasksVisible); 
    this.resetOtherStates("view")
  }

  onUpdateTask(taskId: string) {
    console.log(`Task ID to update: ${taskId}`);
    this.SharedDataService.setTasksVisibleState(false); // Hide the read/view form
    this.apiService.getTaskbyIdApi(taskId).subscribe((response) => {
      console.log("got task data successfully to update");
      console.log(JSON.stringify(response.task))
      this.SharedDataService.setTaskToUpdate(response.task)
      this.SharedDataService.setUpdateTaskState(true);
    } , (error) => {
      console.log("erro while getting the task data to update");
    })
  }

  //deleting the task soft delete
  onTaskDelete(taskId: string) {
    console.log(`deleting the task with id: ${taskId}`);
    this.idToDeleteTask = taskId;
    this.SharedDataService.setDeletePop(true); // Set the delete state in the shared service
  }

  onDeleteConfirm() {
    const taskIndex = this.tasks.findIndex(task => task._id === this.idToDeleteTask);
    if (taskIndex !== -1) {
      const deletedTask = this.tasks.splice(taskIndex, 1)[0];
      this.deletedTasks.push(deletedTask);
      localStorage.setItem('deletedTasks', JSON.stringify(this.deletedTasks));
      this.totalRecords = this.tasks.length;
      this.updatePagination();
    }
    console.log(`Task with id ${this.idToDeleteTask} deleted`);
    this.SharedDataService.setDeletePop(false); // Reset the delete state
  }


  updatePagination() {
    // Calculate the total number of pages
    const totalPages = Math.ceil(this.totalRecords / this.rows);

    // If we're on a page that doesn't exist anymore, move to the last page
    if (this.first >= this.totalRecords) {
      this.first = Math.max(0, (totalPages - 1) * this.rows); // Set to the last page
    }
  }

  onDeleteCancel() {
    console.log('Delete canceled');
    this.SharedDataService.setDeletePop(false); // Reset the delete state
  }

}
