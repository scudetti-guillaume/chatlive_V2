import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Socket } from 'ngx-socket-io';
import { ToasterService } from '../toaster.service';
import { StaticDataService } from '../providers/static-data-services.service';

const userId = localStorage.getItem('id');
const pseudo = localStorage.getItem('pseudo');
const data = { userId, pseudo, }

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 
  private _title: string = " ";
  private _loginBtnLabel: string = " ";
  private _logoutBtnLabel: string = " ";





  constructor(private dialog: MatDialog, private socket: Socket, private toaster: ToasterService, private staticDataService: StaticDataService) {}
  ngOnInit(): void {
    this._title = this.staticDataService.title;
    this._loginBtnLabel = this.staticDataService.loginBtnLabel;
    this._logoutBtnLabel = this.staticDataService.logoutBtnLabel;
  }
  openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => { });
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
          this.socket.emit('get-all-user');
          window.location.reload();
        }, 2000)
      }
    })

  }


  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }
  public get logoutBtnLabel(): string {
    return this._logoutBtnLabel;
  }
  public set logoutBtnLabel(value: string) {
    this._logoutBtnLabel = value;
  }
  public get loginBtnLabel(): string {
    return this._loginBtnLabel;
  }
  public set loginBtnLabel(value: string) {
    this._loginBtnLabel = value;
  }
}
