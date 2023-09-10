// toast.service.ts
import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title: string) {
    const successOptions: any = {
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-position',
      extendedTimeOut: 3000,
      toastClass: 'toast-success',
      titleClass: 'toast-title-success',
      messageClass: 'toast-message-success',
      progressBarClass: 'toast-progress-bar-success',
      componentProps: {
        title: 'Succès',
        message: message,
        isSuccess: true,
      },
    };
    this.toastr.success(title, message, successOptions);
  }

  showError(message: string, title: string) {
    const errorOptions: any = {
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-position',
      toastClass: 'toast-error',
      progressBarClass: 'toast-progress-bar-error',
      titleClass: 'your-custom-title-class',
      messageClass: 'toast-message-error',
      extendedTimeOut: 3000,
      componentProps: {
        title: 'Échec',
        message: message,
        isSuccess: false,
      },
    };

    this.toastr.error(title, '', errorOptions);
  }
}