import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Socket } from 'ngx-socket-io';
import { ToasterService } from '../toaster.service';

const userId = localStorage.getItem('id');
const pseudo = localStorage.getItem('pseudo');
const data = { userId, pseudo, }

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private dialog: MatDialog, private socket: Socket, private toaster: ToasterService,) {}
openLoginModal(): void {
  const dialogRef = this.dialog.open(LoginComponent, {
    width: '400px', 
    data: {} 
  });

  dialogRef.afterClosed().subscribe(result => {});
}



  logout() {
    this.socket.emit('logout-user', data)
    this.socket.on('logout-response', (response: any) => {
      if (response.success) {
        this.toaster.showSuccess('', 'Deconnexion réussie' + ' ' + response.logoutData.pseudo);
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          localStorage.removeItem('pseudo');
          localStorage.removeItem('email');
          localStorage.removeItem('picture');
          window.location.reload();
        }, 2000)
      }
    })

  }

}
