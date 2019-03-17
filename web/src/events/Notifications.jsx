// Notifications Class, stores the time at which the notification should be issued and 
// the type of notification.


class Notifications {
    static noteEnum = {
        EMAIL: 'email',
        TEXT: 'text',
        PUSH: 'push',
        BANNER: 'banner'
    }
    constructor(notificationType, timeBefore, eventTime) {
        this.notificationTime = EventTime.setMinutes(eventTime.getMinutes() - timeBefore);

        this.notificationType = notificationType;
    }

    get notificationType () {
        return notificationType;
    }

    get notificationTime() {
        return notificationTime;
    }

    set notificationType(value) {
        switch (value) {
            case Notifications.noteEnum.EMAIL:
                this._notificationType = Notifications.noteEnum.EMAIL;
                break;
            case Notifications.noteEnum.TEXT:
                this._notificationType = Notifications.noteEnum.TEXT;
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

    set notificationTime(value) {
        this._notificationTime = value;
    }

    equals(notification) {
        if (notification._notificationTime.getTime() == this._notificationTime.getTime() && notification._notificationType.valueOf() == this._notificationType.valueOf()) {
            return true;
        }
        else {
            return false;
        }
    }
}

export default Notifications;