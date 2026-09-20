import type { Notification } from '../../services/NotificationService';
import { NotificationService } from '../../services/NotificationService';

export class NotificationView {
  private readonly container: HTMLElement;

  public constructor(service: NotificationService) {
    this.container = document.createElement('div');
    this.container.className = 'toast-container position-fixed top-0 end-0 p-3';
    this.container.ariaLive = 'polite';
    document.body.append(this.container);

    service.subscribe((notification) => this.show(notification));
  }

  private show(notification: Notification): void {
    const toast = document.createElement('div');
    toast.className = `toast show border-0 text-bg-${notification.type}`;
    toast.role = 'status';

    const wrapper = document.createElement('div');
    wrapper.className = 'd-flex';

    const body = document.createElement('div');
    body.className = 'toast-body';

    const title = document.createElement('strong');
    title.className = 'd-block mb-1';
    title.textContent = notification.title;

    const message = document.createElement('span');
    message.textContent = notification.message;

    const close = document.createElement('button');
    close.className = 'btn-close btn-close-white me-2 m-auto';
    close.type = 'button';
    close.ariaLabel = 'Закрити';
    close.addEventListener('click', () => toast.remove());

    body.append(title, message);
    wrapper.append(body, close);
    toast.append(wrapper);
    this.container.append(toast);

    window.setTimeout(() => toast.remove(), 4500);
  }
}
