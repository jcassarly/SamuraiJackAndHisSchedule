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
        NotificationEnum} from './InputFormComponents'
import StandardEventForm from './StandardEventForm'

class LocationEventForm extends StandardEventForm {
    render() {
        return (
            <StandardEventForm title="Location Event Form" hideLock="true" returnHome={this.props.returnHome} />
        )
    }
}

export default LocationEventForm