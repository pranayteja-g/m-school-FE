import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private username !: String;
  private userId !: number;

  getUsername(): String {
    return this.username;
  }
  setUsername(username: String) {
    this.username = username;
  }

  getUserId(): number {
    return this.userId;
  }
  setUserId(userId: number) {
    this.userId = userId;
  }

  constructor() { }
}
