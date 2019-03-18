import React from 'react';
import StandardEventForm from './StandardEventForm';

class LocationEventForm extends StandardEventForm {
    render() {
        return (
            <StandardEventForm title="Location Event Form" hideLock="true" returnHome={this.props.returnHome} />
        );
    }
}

export default LocationEventForm;
