import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private isUpdateTaskFormVisible = new BehaviorSubject<boolean>(false);
  isUpdateTaskOpen$ = this.isUpdateTaskFormVisible.asObservable();

  private isCreateTaskFromVisibleSource = new BehaviorSubject<boolean>(false);
  isCreateTaskFromVisible$ = this.isCreateTaskFromVisibleSource.asObservable();

  private isTasksVisibleSource = new BehaviorSubject<boolean>(false);
  isTasksVisible$ = this.isTasksVisibleSource.asObservable();

  private isDeleteSource = new BehaviorSubject<boolean>(false);
  isDelete$ = this.isDeleteSource.asObservable();

  private userFirstNameSource = new BehaviorSubject<string>("");
  userFirstName$ = this.userFirstNameSource.asObservable();

  private isHomePageVisibleSource = new BehaviorSubject<boolean>(true);
  isHomePageVisible$ = this.isHomePageVisibleSource.asObservable();


  private isSidebarVisibleSource = new BehaviorSubject<boolean>(false);
  isSidebarVisible$ = this.isSidebarVisibleSource.asObservable();
  constructor() { }

  setSidebarVisibility(state : boolean){
    this.isSidebarVisibleSource.next(state)
  }

  setHomePageVisibility(state : boolean){
    this.isHomePageVisibleSource.next(state)
  }

  setUserFirstName(firstName : string){
    this.userFirstNameSource.next(firstName)
  }

  setDeletePop(state : boolean){
    this.isDeleteSource.next(state)
  }

  setUpdateTaskState(state : boolean){
    this.isUpdateTaskFormVisible.next(state)
  }

  setCreateTaskState(state : boolean){
    this.isCreateTaskFromVisibleSource.next(state)
  }

  setTasksVisibleState(state : boolean){
    this.isTasksVisibleSource.next(state)
  }

  // Add a BehaviorSubject to store task data
  private taskToUpdateSubject = new BehaviorSubject<any>(null);
  taskToUpdate$ = this.taskToUpdateSubject.asObservable();

  // Method to update the task data
  setTaskToUpdate(task: any) {
    this.taskToUpdateSubject.next(task);
  }

}
