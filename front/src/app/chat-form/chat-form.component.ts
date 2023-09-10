import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToasterService } from '../toaster.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { FileUploadService } from '../upload-file.service';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
interface ChatMessage {
  formatImage: any;
  text: string;
  pseudo: string;
  userId: string;
  date: string;
  pictureUser: string ;
  pictureMessage: string | File | Blob | ArrayBuffer;
  pictureName: string ;
}

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss'],
  // imports: [ MatIconModule,],
})
export class ChatFormComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
  @ViewChild('fileInput2') fileInput2!: ElementRef<HTMLInputElement>
  private socket!: Socket;
  pseudo = localStorage.getItem('pseudo');
  email = localStorage.getItem('email');
  userId = localStorage.getItem('id');
  token = localStorage.getItem('token');
  pictureUser = localStorage.getItem('picture');
  messages: { pictureMessage: string | File | Blob | ArrayBuffer , pictureUser: string, userId: string, date: string, pseudo: string, text: string; type: 'incoming' | 'outgoing' }[] = [];
  newMessage: string = '';
  displayStyle = "none";
  displayStyleUser = "none";
  userProfileData: any = {};
  selectedFile: File | null = null;
  selectedFile2: File | null = null;
  users: any = [];
  selectedFileName: string;
  selectedFileName2: string;
  selectedImage: File | string | ArrayBuffer | null = null;
  selectedImage2: File | string | ArrayBuffer | null = null;
  pictureMessage: Blob | File | ArrayBuffer | string | null = null ;
  pictureName: string;
  formatImage: null;

  constructor(private socketService: Socket, private toaster: ToasterService, private datePipe: DatePipe, private fileUploadService: FileUploadService) { }


  openPopup(id: string) {
    this.userProfileData = { userId: id, pseudo: this.pseudo, picture: this.pictureUser };
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
    this.selectedFileName = null
  }

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
          const fileName = inputElement.files[0].name;
      const sanitizedFileName = fileName.replace(/\s/g, '').toLowerCase();;
      this.selectedFileName = sanitizedFileName;   
    } else {
      this.selectedFileName = undefined;
    }
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (allowedExtensions.includes('.' + fileExtension)) {
      this.selectedFile = file;
    } else {
      this.toaster.showError('', "les formats acceptés sont : '.jpg', '.jpeg', '.png', '.gif'");
      console.error('Extension de fichier non autorisée');
    }
  }

  onFileSelected2(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const sanitizedFileName = fileName.replace(/\s/g, '').toLowerCase();;
      this.selectedFileName2 = sanitizedFileName
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage2 = reader.result;
        // console.log(this.selectedImage2);
      };
      reader.readAsDataURL(file);
    }
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (allowedExtensions.includes('.' + fileExtension)) {
      this.selectedFile2 = file;
    } else {
      this.toaster.showError('', "les formats acceptés sont : '.jpg', '.jpeg', '.png', '.gif'");
      console.error('Extension de fichier non autorisée');
    }
  }

  deleteImage(){
    this.selectedImage = null;
    this.selectedFileName = null;
  }

  deleteImage2() {
    this.selectedImage2 = null;
    this.selectedFileName2 = null;
    this.selectedFile2 = null;
  }


  updateProfile() {
    if (this.selectedFile && this.userId) {
      console.log('alalalalalalala');
      console.log(this.selectedFile);
      console.log(this.userId);
     const file = this.selectedFile.name
      const type = this.selectedFile.type.split('/')[1]
  
      this.fileUploadService.uploadFile(this.selectedFile,this.userId, type).subscribe({
        next: (status: string) => {
          if (status === 'success') {
            this.selectedFile = null;
            this.closePopup();
            // this.fileInput.nativeElement.value = '';
            this.selectedFileName = undefined;
            this.updateProfilPicture();
            this.socket.emit('get-all-messages');
          } else {
            console.error('Erreur lors du téléchargement du fichier.');
          }
        },
        error: (error: any) => {
          console.error('Erreur lors du téléchargement du fichier :', error);
        },
      });
    }
  }

  updateProfilPicture() {
    this.socket.emit('get-user', this.userId,);
    this.socket.on('user', (user: any) => {
      localStorage.setItem('picture', user.user.pictureUser);
      this.pictureUser = localStorage.getItem('picture');
    })
  }

  formatDate(dateString: string): string {
    const messageDate = new Date(dateString);
    const currentDate = new Date();

    if (this.isToday(messageDate, currentDate)) {
      return `Aujourd'hui à ${this.datePipe.transform(messageDate, 'HH:mm:ss')}`;
    } else if (this.isYesterday(messageDate, currentDate)) {
      return `Hier à ${this.datePipe.transform(messageDate, 'HH:mm:ss')}`;
    } else {
      return `Le ${this.datePipe.transform(messageDate, 'dd MMM yyyy HH:mm:ss')} || '';`
    }
  }

  isToday(messageDate: Date, currentDate: Date): boolean {
    return (
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear()
    );
  }

  isYesterday(messageDate: Date, currentDate: Date): boolean {
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    return (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnInit(): void {
    this.socket = this.socketService;

    this.socket.on('chat-message-resend', (message: ChatMessage) => {
    console.log(message);
    
      if (message.userId === undefined && message.pseudo === undefined) {
        this.toaster.showError('', 'Veuillez vous identifier pour envoyer un message');
      }
      if (message.userId === this.userId) {
        this.messages.push({ pictureMessage: message.pictureMessage, pictureUser: message.pictureUser, userId: message.userId, date: this.formatDate(message.date), pseudo: message.pseudo, text: message.text, type: 'outgoing' });
      } else {
        this.messages.push({ pictureMessage: message.pictureMessage, pictureUser: message.pictureUser, userId: message.userId, date: this.formatDate(message.date), pseudo: message.pseudo, text: message.text, type: 'incoming' });
      }
    });
    this.socket.emit('get-all-message');
    this.socket.on('chat-message-resend-all', (messageAll: any) => {
      this.messages = [];
      messageAll.messagesArray.forEach((message: {
        pictureMessage: Blob | null | ArrayBuffer | string;
        pictureUser: string, userId: string, date: string; pseudo: any; text: any;
        
      }) => {

        if (message.userId === this.userId) {
          this.messages.push({ pictureMessage: message.pictureMessage, pictureUser: message.pictureUser, userId: message.userId, date: this.formatDate(message.date), pseudo: message.pseudo, text: message.text, type: 'outgoing' });
        } else {
          this.messages.push({ pictureMessage: message.pictureMessage, pictureUser: message.pictureUser, userId: message.userId, date: this.formatDate(message.date), pseudo: message.pseudo, text: message.text, type: 'incoming' });
        }
      });
    });
    // this.socket.emit('get-all-user')
    // this.socket.on('All-user', (users: any) => {
    // this.users = [];
    // users.userArray.forEach((user: { _id: string; pseudo: string; pictureUser: string; email: string}) => {
    //     this.users.push(user);
    // })
    // });
  }

  ngOnDestroy(): void { }


dataURItoBlob(dataURI: string): Blob {
  // Divisez la chaîne base64 en deux parties : le type de média et les données réelles
  const [dataParts, base64Data] = dataURI.split(',');

  // Extraire le type de média (ex: "image/jpeg")
  const mediaType = dataParts.match(/:(.*?);/)[1];

  // Convertir la chaîne base64 en tableau d'octets
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Créez un tableau d'octets sous forme d'objet Blob
  return new Blob([new Uint8Array(byteNumbers)], { type: mediaType });
}


  
  sendMessage() {
    const messageData: ChatMessage = {
      text: this.newMessage,
      pseudo: this.pseudo || '',
      userId: this.userId || '',
      date: this.datePipe.transform(new Date(), 'dd MMM yyyy HH:mm:ss') || '',
      pictureUser: this.pictureUser || '',
      pictureMessage: '', // Initialisez à null pour le moment
      pictureName: '' || null,
      formatImage: ''
    };

    if (messageData.userId === '' && messageData.pseudo === '') {
      this.toaster.showError('', 'Veuillez vous identifier pour envoyer un message');
    }

    if (this.newMessage.trim() !== '' && this.selectedImage2 === null) {
      // Le message texte n'est pas vide
      this.socket.emit('chat-message-send', messageData);
      // this.socket.emit('get-all-message');
    }

    if (this.selectedFile2 != null) {
      if (this.selectedFile2 instanceof File) {
        // Une image a été sélectionnée
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            const imageFile = new File([event.target.result], this.selectedFileName2);
            console.log(event.target);
            messageData.pictureMessage = imageFile;
            const fileName = this.selectedFile2.name;
            const sanitizedFileName = fileName.replace(/\s/g, '').toLowerCase();
            this.selectedFileName2 = sanitizedFileName;
            messageData.pictureName = this.selectedFileName2;
            this.socket.emit('chat-message-send', messageData);

            // Réinitialisez les valeurs après l'envoi
            this.newMessage = '';
            this.selectedFileName2 = null;
            this.selectedImage2 = null;
            // this.selectedFile2 = null; // Réinitialisation de this.selectedFile2
          }
        };
        reader.readAsArrayBuffer(this.selectedFile2);
      }
    }

    // Réinitialisez les valeurs après l'envoi
    this.newMessage = '';
    this.selectedFileName2 = null;
    this.selectedImage2 = null;
    setTimeout(() => { this.selectedFile2 = null }, 1000);
  ; // Réinitialisation de this.selectedFile2
  }


  resetFile() {
    this.selectedFile2 = null
  }






  }






 // sendMessage() {
  //   if (this.newMessage.trim() === '' && !this.selectedImage2) {
  //   return
    
  //   }
  //     if (this.newMessage.trim() != '' && !this.selectedImage2) {
  //     const messageData: ChatMessage = {
  //       text: this.newMessage,
  //       pseudo: this.pseudo || '',
  //       userId: this.userId || '',
  //       date: this.datePipe.transform(new Date(), 'dd MMM yyyy HH:mm:ss') || '',
  //       pictureUser: this.pictureUser || '',
  //       pictureMessage: '',
  //       pictureName: '',
  //       data: undefined,
  //       formatImage: undefined
  //     };
  //     if (messageData.userId === '' && messageData.pseudo === '') {
  //       this.toaster.showError('', 'Veuillez vous identifier pour envoyer un message');
  //     }
  //     else {

  //       this.socket.emit('chat-message-send', messageData);
  //       // this.socket.emit('get-all-message')
  //       this.newMessage = '';
  //     }
  //     } else {
   
 

  //   const messageData: ChatMessage = {
  //     text: this.newMessage,
  //     pseudo: this.pseudo || '',
  //     userId: this.userId || '',
  //     date: this.datePipe.transform(new Date(), 'dd MMM yyyy HH:mm:ss') || '',
  //     pictureUser: this.pictureUser || '',
  //     pictureMessage: this.pictureMessage,
  //     pictureName: null,
  //     data: undefined,
  //     formatImage: undefined
  //   };

  //   if (messageData.userId === '' && messageData.pseudo === '') {
  //     this.toaster.showError('', 'Veuillez vous identifier pour envoyer un message');
  //   } else {
     
  //     if (typeof this.selectedImage2 === 'string') {
  //       // console.log(this.selectedImage);
      
  //       messageData.pictureMessage = this.selectedImage2;
  //       messageData.pictureName = this.selectedFileName2 || null;
  //       this.sendMessageToServer(messageData);
  //     } else if (this.selectedImage instanceof File) {
  //       // Une image a été sélectionnée
  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //         if (event.target) {
            
  //           const imageBase64 = event.target.result as ArrayBuffer;
  //           console.log(imageBase64);
            
  //           messageData.pictureMessage = imageBase64;
  //           messageData.pictureName = this.selectedFileName2 || null;
  //           this.sendMessageToServer(messageData);
  //         }
  //       };
  //       reader.readAsDataURL(this.selectedImage);
  //     }
  //     }
  //   }
  // }

  // sendMessageToServer(messageData: ChatMessage) {

  //   this.newMessage = '';
  //   this.selectedFileName2 = null;
  //   this.selectedImage2 = null;
    
  //   this.socket.emit('chat-message-send', messageData);
  //   // this.socket.emit('get-all-message')
  // }