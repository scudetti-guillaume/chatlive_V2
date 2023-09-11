import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private socket: Socket,private authService: AuthService) {}
  // Intervalle de ping en millisecondes (2 minutes)

test(){
  const PING_INTERVAL = 12000;
  setInterval(() => {
    this.socket.emit('get-all-user')// Émet un événement "ping" périodiquement
  }, PING_INTERVAL);
}
  
   ngOnInit() {
    if (this.authService.isAuthenticated()) {
     this.socket.emit('get-all-messages')
     this.socket.emit('get-all-user')
    } else {
      this.authService.login();
    }
    
    if (this.authService.isLogged()) {
    
      const id = localStorage.getItem('id');
      this.socket.emit('isconnected',id)
      this.socket.emit('get-all-user')
    }
     this.test()
  }
  
 

  ngOnDestroy() {
    this.socket.emit('get-all-user')
    }
    
   

  
}
