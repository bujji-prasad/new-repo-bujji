import { Component, OnInit , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-update-task',
  imports: [FormsModule,CommonModule,SidebarModule,ButtonModule, RadioButtonModule, FloatLabelModule, DatePickerModule, CheckboxModule,CardModule, InputTextModule, SelectModule],
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.scss'
})
export class UpdateTaskComponent implements OnInit {
  Task = {
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: '',
    status: '',
    markasRead: false
  };

  users = ['bujji','prassu','ganesh'];

  priorities = ['Low','Medium','High'];


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

  taskToUpdate : any = null;
  
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef , private sharedDataService : SharedDataService) { }




  ngOnInit(): void {
    // Subscribe to taskToUpdate observable to get task data
    this.sharedDataService.taskToUpdate$.subscribe(task => {
      console.log(`task in ngonit in update from componnet : ${JSON.stringify(task)}`)
        this.taskToUpdate = task;
        if (this.taskToUpdate.dueDate && typeof this.taskToUpdate.dueDate === 'string') {
          this.taskToUpdate.dueDate = new Date(this.taskToUpdate.dueDate);  // Convert string to Date
        }
      })
  }


  updatingTask(taskId : String){
    console.log(`on update task is clicked on upate task component : ${taskId}`)
    this.apiService.updateTaskApi(taskId , this.taskToUpdate).subscribe((response) => {
      console.log(`task is updated on backend `)
      this.sharedDataService.setUpdateTaskState(false)
      this.sharedDataService.setTasksVisibleState(true)
    } , (error) => {
      console.log("error while updating the task");
    })
  }

  updatingTaskCancel(){
    this.sharedDataService.setUpdateTaskState(false)
      this.sharedDataService.setTasksVisibleState(true)
  }
}
