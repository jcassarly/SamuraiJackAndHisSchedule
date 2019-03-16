import React from 'react';
import DateTime from 'react-datetime';
import moment from 'moment'
import {NameInput,
        DescriptionInput,
        StartEndInput,
        LocationInput,
        NotificationSelect,
        NotificationTime,
        FrequencySelect,
        LockEventInput,
        FreqEnum,
        NotificationEnum} from './InputFormComponents'
import StandardEventForm from './StandardEventForm'

class LocationEventForm extends StandardEventForm {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StandardEventForm title="Location Event Form" hideLock="true" />
        )
    }
}

export default LocationEventForm