import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ToasterService } from '../toaster.service'

interface RegistrationData {
  pseudo: string;
  email: string;
  password: string;
}

interface RegistrationResponse {
  id : string ;
  success: boolean;
  pseudo: string;
  email: string;
  password: string;
  error:string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  id : string = '';
  pseudo: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  modalOpen: boolean = true;
  
  constructor(private socket: Socket, private toastr: ToastrService, private toaster: ToasterService,private dialogRef: MatDialogRef<RegisterComponent>) {}
  
  closeModal() {
    this.dialogRef.close(); 
  }
  
  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.toaster.showError( 'Erreur','les mots de passe ne correspondent pas');
      console.log('Passwords do not match');
      return;
    }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.toaster.showError( 'Erreur','Veuillez entrer une adresse email valide.');
      return;
    }
    const registration: RegistrationData = {
      pseudo: this.pseudo,
      email: this.email,
      password: this.password
    };

    this.socket.emit('register-user', registration);

    this.socket.on('registration-response', (response: RegistrationResponse) => {
      console.log('Received registration response:', response);
      if (response.success === true) {
      this.toaster.showSuccess('', 'Inscription validée avec succès ');
        setTimeout(() => {
        this.pseudo = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
       this.dialogRef.close();
       }, 3000);
      }else {
        this.toaster.showError("Erreur lors de l'inscription :" , response.error);
        // this.toastr.error( 'Erreur','Veuillez verifier vos informations');
      }
    });
  }
}






