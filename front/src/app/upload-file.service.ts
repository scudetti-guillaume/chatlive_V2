import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';
const user = localStorage.getItem('id');
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private socket: Socket) { }

  uploadFile(file: File, user: string, type: string): Observable<string> {
    const CHUNK_SIZE = 9999; // Taille maximale par chunk
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0;

    return new Observable<string>((observer: Observer<string>) => {
      const socket = this.socket; // Assurez-vous d'utiliser la référence à la socket correcte.

      const reader = new FileReader();

      reader.onload = () => {
        const chunk = reader.result as ArrayBuffer;
        const isLastChunk = currentChunk === totalChunks - 1;

        console.log(`Envoi du chunk ${currentChunk + 1}/${totalChunks}`);

        socket.emit('upload', { chunk, user, type, isLastChunk }, (status: string) => {
          console.log('Statut de téléchargement renvoyé par le serveur :', status);
          observer.next(status);

          if (isLastChunk) {
            observer.complete();
          } else {
            currentChunk++;
            readNextChunk();
          }
        });
      };

      reader.onerror = (error) => {
        console.error('Erreur lors de la lecture du chunk :', error);
        observer.error(error);
      };

      const readNextChunk = () => {
        const startByte = currentChunk * CHUNK_SIZE;
        const endByte = Math.min((currentChunk + 1) * CHUNK_SIZE, file.size);
        const blobChunk = file.slice(startByte, endByte);
        reader.readAsArrayBuffer(blobChunk);
      };

      readNextChunk(); // Commencez par lire le premier chunk.
    });
  }
}


// uploadFile(file: File, user: string, type: string): Observable < string > {
//   return new Observable<string>((observer: Observer<string>) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       if (event.target) {

//         console.log('LALALALALALALALALALALALALALA');
//         console.log(event.target.result);
//         const fileData = event.target.result as ArrayBuffer;
//         console.log(fileData);

//         this.socket.emit('upload', { fileData, user, type }, (status: string) => {
//           console.log('Statut de téléchargement renvoyé par le serveur :', status);
//           observer.next(status);
//           observer.complete();
//         });
//       } else {
//         observer.error("L'événement n'a pas de cible.");
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   });
// }