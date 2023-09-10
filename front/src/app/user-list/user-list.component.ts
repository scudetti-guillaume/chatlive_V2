import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  userOnline: any[] = [];
  userOffline: any[] = [];


  constructor(private socket: Socket) { }

  ngOnInit(): void {
  
    // this.socket.on('user-online', ({} ) => {
    //   this.socket.emit('get-all-user');
    // });
  

    this.socket.on('All-user', (data: any[string]) => {
      this.userOffline = [];
      this.userOnline = [];
      data.userArray.forEach((user: { login: boolean; }) => {
        this.users = data.userArray;
        if (user.login === true) {
         console.log(user);
         
          this.userOnline.push(user);
        } else {
          this.userOffline.push(user);
        }
      })
    });
  }
}
