import { expect } from 'chai';

import type { Notification } from '../src/services/NotificationService';
import { NotificationService } from '../src/services/NotificationService';

describe('NotificationService', () => {
  it('publishes notifications until a listener unsubscribes', () => {
    const service = new NotificationService();
    const received: Notification[] = [];
    const unsubscribe = service.subscribe((notification) => received.push(notification));
    const notification: Notification = {
      title: 'Готово',
      message: 'Книгу повернено',
      type: 'success',
    };

    service.publish(notification);
    unsubscribe();
    service.publish(notification);

    expect(received).to.deep.equal([notification]);
  });
});
