// import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import { UploadEvent, FileLikeObject } from 'socketio-file-upload';
// import { Observable, Observer } from 'rxjs';// Importez les classes nécessaires

// @Injectable({
//   providedIn: 'root',
// })
// export class FileUploadService {
//   constructor(private socket: Socket) { }

//   // ...

//   // Créez une méthode pour gérer les téléchargements de fichiers
//   uploadFile(event: UploadEvent): Observable<string> {
//     return new Observable<string>((observer: Observer<string>) => {
//     // Traitez l'événement de téléchargement ici
//     const files: FileLikeObject[] = event.files;
//     if (files.length > 0) {
//       const formData = new FormData();
//       formData.append('file', files[0].file);

//       // Envoyez le formulaire contenant le fichier au serveur via Socket.IO
//       this.socket.emit('upload', formData, (status: string) => {
//         console.log('Statut de téléchargement renvoyé par le serveur :', status);
//       });
//     }
//   })}
// }
