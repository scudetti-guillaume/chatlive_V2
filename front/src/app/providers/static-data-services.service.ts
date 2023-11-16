import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  private _title = "ChatDirect";
  private _loginBtnLabel = "Login";
  private _logoutBtnLabel = "logout";

  constructor() { }

  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  public get loginBtnLabel() {
    return this._loginBtnLabel;
  }
  public set loginBtnLabel(value) {
    this._loginBtnLabel = value;
  }

  public get logoutBtnLabel() {
    return this._logoutBtnLabel;
  }
  public set logoutBtnLabel(value) {
    this._logoutBtnLabel = value;
  }

}
