
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private messageService: MessageService) { }

  showSuccess(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary: summary, detail: detail });
  }

  showInfo(summary: string, detail: string): void {
    this.messageService.add({ severity: 'info', summary: summary, detail: detail });
  }

  showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'An Error Occured', detail: detail });
  }
}
