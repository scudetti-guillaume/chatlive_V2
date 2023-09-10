import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common'; 
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToasterService } from './toaster.service';
import { UserListComponent } from './user-list/user-list.component';
import { UserModalComponent } from './user-modal/user-modal.component';

const jwtToken = localStorage.getItem('token');

const customSocketConfig: SocketIoConfig = {
  // url: 'https://www.lesiteduscudo.com',
   url: 'http://localhost:5000',
  options: {
    // path: "/chatsocV2/backend",
    extraHeaders: {
      Authorization: `Bearer ${jwtToken}`
    }
  }
};

@NgModule({
  declarations: [
    AppComponent,
    ChatFormComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    UserListComponent,
    UserModalComponent,
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(customSocketConfig),
    ToastrModule.forRoot(), // Affiche un bouton de fermeture pour chaque toast  
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [ToasterService, DatePipe,],
  bootstrap: [AppComponent]
})
export class AppModule { }