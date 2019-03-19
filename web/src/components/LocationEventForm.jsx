import React from 'react';
import StandardEventForm from './StandardEventForm';

class LocationEventForm extends StandardEventForm {
    render() {
        return (
            <StandardEventForm title="Location Event Form" hideLock returnHome={this.props.returnHome} />
        );
    }
}

export default LocationEventForm;
