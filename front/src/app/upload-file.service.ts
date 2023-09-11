import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';
const user = localStorage.getItem('id');
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private socket: Socket) { }

  uploadFile(file: File, user: string,type:string): Observable<string> {
    return new Observable<string>((observer: Observer<string>) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const fileData = event.target.result as ArrayBuffer;
          this.socket.emit('upload', { fileData, user,type}, (status: string) => {
            console.log('Statut de téléchargement renvoyé par le serveur :', status);
            observer.next(status); 
            observer.complete(); 
          });
        } else {
          observer.error("L'événement n'a pas de cible.");
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }
}


