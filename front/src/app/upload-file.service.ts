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
          console.log(fileData);

          // Utilisez file.user pour obtenir l'ID de l'utilisateur
          // userId = user;

          this.socket.emit('upload', { fileData, user,type}, (status: string) => {
            console.log('Statut de téléchargement renvoyé par le serveur :', status);
            observer.next(status); // Émettez le statut à l'observateur
            observer.complete(); // Indiquez que l'observable est terminé
          });
        } else {
          console.error("L'événement n'a pas de cible.");
          observer.error("L'événement n'a pas de cible.");
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }
}



  // async uploadFile(file: File,user:string): Promise<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('userId', user);
  //   console.log(formData);
  
    // try {
    // await axios.get('https://www.lesiteduscudo.com/chatsocV2/backend/gettest').then(response =>{
    
    // console.log(response);
    
    // })
    //   // const response = await axios
    //   //   .post('https://www.lesiteduscudo.com/chatsocV2/backend/upload', formData , {
    //   //     headers: {
    //   //       'Content-Type': 'multipart/form-data',
    //   //     },
    //   //   });
    //   //  console.log(response.data);
       
    //   // return response.data;
    // } catch (error) {
    //   console.error('Erreur lors du téléchargement du fichier :', error);
    //   throw error;
    // }
  // }