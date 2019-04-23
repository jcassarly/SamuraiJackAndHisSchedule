// Notifications Class, stores the time at which the notification should be issued and
// the type of notification.


class Notifications {
    static noteEnum = {
        EMAIL: 'email',
        TEXT: 'text',
        PUSH: 'push',
        BANNER: 'banner',
    }

    constructor(notificationType, timeBefore, eventTime) {
        this.notificationTime = eventTime.clone().minute(eventTime.minute() - timeBefore);

        this.notificationType = notificationType;
    }

    // returns the type of notification as a String
    get notificationType() {
        return this._notificationType;
    }

    // returns the time before the event at which the notification is issued
    get notificationTime() {
        return this._notificationTime;
    }

    // sets notificationType to a string based on an enum
    set notificationType(value) {
        switch (value) {
        case Notifications.noteEnum.EMAIL:
            this._notificationType = Notifications.noteEnum.EMAIL;
            break;
        case Notifications.noteEnum.TEXT:
            this._notificationType = Notifications.noteEnum.TEXT;
            break;
        case Notifications.noteEnum.PUSH:
            this._notificationType = Notifications.noteEnum.PUSH;
            break;
        case Notifications.noteEnum.BANNER:
            this._notificationType = Notifications.noteEnum.BANNER;
            break;
        default:
            throw new Error('not a valid notification type');
        }
    }

    // sets notificationTime to a number
    set notificationTime(value) {
        this._notificationTime = value;
    }

    // checks if this notification is equal to an input notification, true if true, false otherwise
    equals(notification) {
        if (notification._notificationTime.getTime() === this._notificationTime.getTime()
        && notification._notificationType.valueOf() === this._notificationType.valueOf()) {
            return true;
        }
        return false;
    }
}

export default Notifications;
