import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {
    NameInput,
    DescriptionInput,
    StartEndInput,
    LocationInput,
    NotificationSelect,
    NotificationTime,
    FrequencySelect,
    LockEventInput,
} from './InputFormComponents';
import InputForm from './InputForm';
import { createEvent } from '../actions/createEvent';
import { Event, RecurringEvent } from '../events/Event';
import Frequency from '../events/Frequency';
import DateErrorMessage from './ErrorMessage';
import '../styles/StandardEventForm.css';

/**
 * React Component that handles standard event input gathering
 */
class StandardEventForm extends React.Component {
    /**
     * Create a form to get input for a standard event
     * @param {func}   props.returnHome  a function to send the user back to home screen
     * @param {func}   props.createEvent a function to create an event in the redux store
     *                                   with the gathered input from the form
     * @param {string} props.title       the name of the event form
     * @param {bool}   props.hideLock    true if the lock form field should be hidden,
     *                                   false if it should appear
     */
    constructor(props) {
        super(props);
        const { title } = this.props;
        this.state = {
            title,
            name: '',
            description: '',
            eventStart: moment(),
            eventEnd: moment().add(1, 'hour'),
            location: '',
            frequency: '',
            notifications: '',
            notificationTime: 0,
            locked: true,
            error: false,
            errorMsg: 'No Error',
        };

        this.frequencySelectChange = this.frequencySelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Gets the required types for the props passed into the constructor
     */
    static get propTypes() {
        return {
            returnHome: PropTypes.func.isRequired,
            createEvent: PropTypes.func.isRequired,
            title: PropTypes.string,
            hideLock: PropTypes.bool,
        };
    }

    /**
     * Gets the default values for props if they are not passed into the constructor
     * and are not required
     */
    static get defaultProps() {
        return {
            title: 'Standard Event Form',
            hideLock: false,
        };
    }

    /**
     * Updates the state with the frequency selection the user made
     * @param {obj} event the event object that stores the selection the user made
     */
    frequencySelectChange(event) {
        this.setState({ frequency: event.target.value });

        if (event.target.value === Frequency.freqEnum.CUSTOM) {
            alert('TODO: open custom choice menu');
        }
    }

    /**
     * Updates the state with the change to the input form the user made
     * @param {obj} event the event object that stores the change the user made
     */
    handleInputChange(event) {
        const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const inputName = event.target.name;

        this.setState({
            [inputName]: newValue,
        });
    }

    /**
     * Updates the state with the change the user made to the start date
     * @param {obj} event the event object that stores the change the user made
     */
    handleStartDateChange(time) {
        this.setState({
            eventStart: time,
        });
    }

    /**
     * Updates the state with the change the user made to the end date
     * @param {obj} event the event object that stores the change the user made
     */
    handleEndDateChange(time) {
        this.setState({
            eventEnd: time,
        });
    }

    /**
     * Creates the Event object, adds it to the redux store, and returns to the home screen
     * @param {obj} event the JS event object that stores the event that called this function
     */
    handleSubmit(event) {
        event.preventDefault();
        const {
            name,
            description,
            eventStart,
            eventEnd,
            location,
            locked,
            notifications,
            frequency,
        } = this.state;

        const {
            returnHome,
        } = this.props;

        // attempt to create the new event and add it to the redux store
        let evt = null;
        try {
            // create a single event if frequency is just once
            if (frequency === '') {
                evt = new Event(
                    name,
                    description,
                    eventStart,
                    eventEnd,
                    location,
                    locked,
                    notifications, // TODO: use notification object here instead
                    null,
                );
            // create a recurring event otherwise with the chosen frequency
            } else {
                evt = new RecurringEvent(
                    name,
                    description,
                    eventStart,
                    eventEnd,
                    location,
                    locked,
                    notifications,
                    frequency,
                    null,
                ); // TODO: handle custom frequency
            }

            // add the Event to the redux store
            // eslint-disable-next-line react/destructuring-assignment
            this.props.createEvent(evt);

            // send the user back to home screen
            returnHome();

        // if creating and adding the event failed, show an error message on the next render
        } catch (e) {
            this.setState({
                error: true,
                errorMsg: e.message,
            });
        }
    }

    /**
     * Load the input form
     */
    render() {
        const {
            returnHome,
            hideLock,
        } = this.props;

        const {
            title,
            name,
            description,
            eventStart,
            eventEnd,
            location,
            frequency,
            notifications,
            notificationTime,
            locked,
            error,
            errorMsg,
        } = this.state;

        // create the JSX object that handles gathering user input as per the Standard Event
        // input form in the design doc
        return (
            <InputForm onSubmit={this.handleSubmit} onBack={returnHome} title={title}>
                <NameInput
                    name="name"
                    value={name}
                    onChange={this.handleInputChange}
                />
                <DescriptionInput
                    name="description"
                    value={description}
                    onChange={this.handleInputChange}
                />
                <DateErrorMessage
                    show={error}
                    errorMsg={errorMsg}
                />
                <StartEndInput
                    start={eventStart}
                    end={eventEnd}
                    startDescription="Event Start Time"
                    endDescription="Event End Time"
                    onStartChange={this.handleStartDateChange}
                    onEndChange={this.handleEndDateChange}
                />
                <LocationInput
                    name="location"
                    value={location}
                    onChange={this.handleInputChange}
                />
                <FrequencySelect
                    name="frequency"
                    value={frequency}
                    onChange={this.frequencySelectChange}
                    data-testid="frq"
                />
                <NotificationSelect
                    name="notifications"
                    value={notifications}
                    onChange={this.handleInputChange}
                />
                <NotificationTime
                    name="notificationTime"
                    value={notificationTime}
                    onChange={this.handleInputChange}
                />

                <LockEventInput
                    name="locked"
                    checked={locked}
                    onChange={this.handleInputChange}
                    hide={hideLock}
                />

            </InputForm>
        );
    }
}

export default connect(null, { createEvent })(StandardEventForm);
