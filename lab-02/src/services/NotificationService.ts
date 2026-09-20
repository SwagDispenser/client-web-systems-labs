export type NotificationType = 'success' | 'danger' | 'info';

export interface Notification {
  title: string;
  message: string;
  type: NotificationType;
}

type NotificationListener = (notification: Notification) => void;

export class NotificationService {
  private readonly listeners = new Set<NotificationListener>();

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public publish(notification: Notification): void {
    for (const listener of this.listeners) {
      listener(notification);
    }
  }
}
