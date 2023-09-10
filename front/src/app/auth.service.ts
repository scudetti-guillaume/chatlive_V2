import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private dialog: MatDialog,) { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => { });
  }


}