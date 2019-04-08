import React from 'react';
import StandardEventForm from './StandardEventForm';

/**
 * Create a react component that handles location event input
 */
class LocationEventForm extends StandardEventForm {
    /**
     * Create the location event JSX object
     *
     * @param {func} props.returnHome a function that sends the user back to the home screen
     */
    render() {
        // the location event form is the same as a standard event form except that
        // the lock field is hidden
        return (
            <StandardEventForm title="Location Event Form" hideLock returnHome={this.props.returnHome} />
        );
    }
}

export default LocationEventForm;
