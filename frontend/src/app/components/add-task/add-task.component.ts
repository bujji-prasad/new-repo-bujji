import { Component, OnInit , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { ChangeDetectorRef } from '@angular/core';
import { SharedDataService } from '../../shared-data.service';


@Component({
  selector: 'app-add-task',
  imports: [CommonModule,ButtonModule, RadioButtonModule, FloatLabelModule, DatePickerModule, CheckboxModule, InputTextModule, FormsModule, SelectModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent{
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

    
  ngOnInit(): void {
    console.log("call life cycle method on add task")
    this.apiService.getUsers().subscribe((response) => {
      const users : any[] = response.users
      const usersFirstnames = users.map(singleUser => singleUser.first_name)
      console.log(usersFirstnames)
      this.users = usersFirstnames
    } , (error) => {
      console.log("error while getting the user sing up data")
    })
  }

  constructor(private SharedDataService : SharedDataService,private apiService: ApiService, private cdr: ChangeDetectorRef ) { }

  createTask(){
    if (!this.Task.title|| !this.Task.assignedTo || !this.Task.dueDate || !this.Task.priority || !this.Task.status) {
      alert('Please fill in all required fields!');
      return;
    }
    console.log(`task before adding : ${JSON.stringify(this.Task)}`)
    this.apiService.addTaskApi(this.Task).subscribe(
        (response) => {
          console.log('Task added to DB:', response);
          this.Task = { title: '', description: '', assignedTo: '', dueDate: '', priority: '', status: '', markasRead: false };
          this.SharedDataService.setCreateTaskState(false);
          this.SharedDataService.setTasksVisibleState(true)
          alert("Task added successfully")
        },
        (error) => {
          console.log('Error while adding task:', error);
          alert('Error while creating task: ' + error.message);
        }
      );
  }

  CancelCreateTask(){
    this.SharedDataService.setCreateTaskState(false)
    this.SharedDataService.setHomePageVisibility(true)
  }

 
}
