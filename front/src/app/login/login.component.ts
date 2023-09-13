import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from '../toaster.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // id: string = '';
  pseudo: string = '';
  email: string = '';
  password: string = '';

  constructor(private socket: Socket, private toaster: ToasterService, private dialogRef: MatDialogRef<LoginComponent>, private dialog: MatDialog) { }

  openRegisterPage() {
    this.dialog.open(RegisterComponent, {
      width: '350px',
      disableClose: true,
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  onSubmit() {

    // const userId = localStorage.getItem('id');
    const loginData = {
      // id: userId,
      pseudo: this.pseudo,
      email: this.email,
      password: this.password,
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.toaster.showError('', 'Veuillez entrer une adresse email valide.' + " " + this.email);
      return;
    }

    this.socket.emit('login-user', loginData);
    this.socket.on('login-response', (response: any) => {
      if (response.success) {
        this.toaster.showSuccess('', 'Connexion réussie' + ' ' + response.loginData.pseudo);
        localStorage.setItem('id', response.loginData.id);
        localStorage.setItem('pseudo', response.loginData.pseudo);
        localStorage.setItem('email', response.loginData.email);
        localStorage.setItem('token', response.loginData.token);
        localStorage.setItem('picture', response.loginData.pictureUser);
        setTimeout(() => {
          this.pseudo = '';
          this.email = '';
          this.password = '';
          this.dialogRef.close();
          this.socket.emit('get-all-messages');
          this.socket.emit('get-all-user');
          window.location.reload();
        }, 3000);
      } else {
        this.toaster.showError("Erreur lors de la connexion :", response.error);
      }
    });
  }
}





