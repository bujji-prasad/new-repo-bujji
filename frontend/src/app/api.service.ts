import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  addTaskApi(task: any): Observable<any> {
    return this.http.post('http://localhost:3000/addTask', task);
  }

  getTasksApi(): Observable<any> {
    return this.http.get('http://localhost:3000/tasks');
  }

  getTaskbyIdApi(taskId: String): Observable<any> {
    return this.http.get(`http://localhost:3000/task/${taskId}`);
  }

  updateTaskApi(taskId: String, task: any): Observable<any> {
    return this.http.put(`http://localhost:3000/taskEdit/${taskId}`, task);
  }

  loginUserApi(user: any): Observable<any> {
    return this.http.post('http://localhost:3000/login', user);
  }

  addUserApi(user: any): Observable<any> {
    console.log(user);
    return this.http.post('http://localhost:3000/add', user);
  }

  getUsers(): Observable<any> {
    return this.http.get('http://localhost:3000/users');
  }

  getLoginUser(): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    console.log(`jwt: ${token}`);
    if (!token) {
      console.error('Token not found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:3000/user', { headers });
  }

}
