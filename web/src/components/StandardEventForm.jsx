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

class StandardEventForm extends React.Component {
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

    static get propTypes() {
        return {
            returnHome: PropTypes.func.isRequired,
            createEvent: PropTypes.func.isRequired,
            title: PropTypes.string,
            hideLock: PropTypes.bool,
        };
    }

    static get defaultProps() {
        return {
            title: 'Standard Event Form',
            hideLock: false,
        };
    }

    frequencySelectChange(event) {
        this.setState({ frequency: event.target.value });

        if (event.target.value === Frequency.freqEnum.CUSTOM) {
            alert('TODO: open custom choice menu');
        }
    }

    handleInputChange(event) {
        const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const inputName = event.target.name;

        this.setState({
            [inputName]: newValue,
        });
    }

    handleStartDateChange(time) {
        this.setState({
            eventStart: time,
        });
    }

    handleEndDateChange(time) {
        this.setState({
            eventEnd: time,
        });
    }

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

        let evt = null;
        try {
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

            // uncomment for debugging
            /* alert(`
                Adding a new standard event with the following info:
                Name:              ${evt.name}
                Description:       ${evt.description}
                Start Time:        ${evt.startTime}
                End Time:          ${evt.endTime}
                Location:          ${evt.location}
                Frequency:         ${evt.frequency}
                Notifications:     ${evt.notifications}
                Locked:            ${evt.locked}
            `); */


            // eslint-disable-next-line react/destructuring-assignment
            this.props.createEvent(evt);
            returnHome();
        } catch (e) {
            this.setState({
                error: true,
                errorMsg: e.message,
            });
        }
    }

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
