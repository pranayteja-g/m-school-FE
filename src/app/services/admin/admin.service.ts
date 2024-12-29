import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8080/admin/user';

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getUserById(id: number) {
    return this.http.get(`${this.baseUrl}/id/${id}`);
  }

  getUserByUsername(username: string) {
    return this.http.get(`${this.baseUrl}/username/${username}`);
  }

  getUsersByRole(role: string) {
    return this.http.get(`${this.baseUrl}/role/${role}`);
  }

  updateUser(id: number, user: any) {
    return this.http.put(`${this.baseUrl}/update/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

}
