import React from 'react';
import { connect } from 'react-redux';
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
    ColorSelect,
} from './InputFormComponents';
import InputForm from '../../components/InputForm';
import FormHelper from '../../components/FormHelper';
import { editEvent } from '../actions/changeEvent';
import { Event } from '../events/Event';
import Frequency from '../events/Frequency';
import DateErrorMessage from '../../components/ErrorMessage';

/**
 * React Component that handles standard event input gathering
 */
class EditEventForm extends React.Component {
    /**
     * Create a form to get input for a standard event
     * @param {func}   props.returnHome  a function to send the user back to home screen
     * @param {func}   props.editEvent a function to edit an event in the redux store
     * @param          props.originalEventId the id of the event being edited
     * @param {string} props.title       the name of the event form
     *                                   false if it should appear
     */
    constructor(props) {
        super(props);
        const { title, events, id } = this.props;
        this.state = {
            title,
            name: events[id].name,
            description: events[id].description,
            eventStart: events[id].startTime,
            eventEnd: events[id].endTime,
            location: events[id].location,
            frequency: (events[id].frequency) ? events[id].frequency.timing : '',
            notifications: events[id].notifications,
            notificationTime: 15,
            color: events[id].color,
            locked: events[id].locked,
            parent: events[id].parent,
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
            editEvent: PropTypes.func.isRequired,
            title: PropTypes.string,
            id: PropTypes.number.isRequired,
            events: PropTypes.objectOf(PropTypes.instanceOf(Event)).isRequired,
        };
    }

    /**
     * Gets the default values for props if they are not passed into the constructor
     * and are not required
     */
    static get defaultProps() {
        return {
            title: 'Edit Event Form',
        };
    }

    /**
     * Updates the state with the frequency selection the user made
     * @param {obj} event the event object that stores the selection the user made
     */
    frequencySelectChange(...args) {
        this.setState({ frequency: FormHelper.getValue(...args) });

        if (FormHelper.getValue(...args) === Frequency.freqEnum.CUSTOM) {
            alert('TODO: open custom choice menu');
        }
    }

    /**
     * Updates the state with the change to the input form the user made
     * @param {obj} event the event object that stores the change the user made
     */
    handleInputChange(...args) {
        const newValue = FormHelper.checkedVal(...args);
        const inputName = FormHelper.getName(...args);
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
    handleSubmit(...args) {
        FormHelper.prevDef(...args);
        const {
            name,
            description,
            eventStart,
            eventEnd,
            location,
            locked,
            notifications,
            color,
            frequency,
            parent,
        } = this.state;
        const { editEvent } = this.props;

        const {
            returnHome,
            id,
        } = this.props;

        try {
            // add a recurring event in place of this event
            if (frequency) {
                editEvent(
                    id,
                    name,
                    description,
                    eventStart,
                    eventEnd,
                    location,
                    locked,
                    notifications, // TODO: use notification object here instead
                    parent,
                    frequency,
                    color,
                );
            // add a singular event in place of this event
            // eslint-disable-next-line react/destructuring-assignment
            } else {
                editEvent(
                    id,
                    name,
                    description,
                    eventStart,
                    eventEnd,
                    location,
                    locked,
                    notifications, // TODO: use notification object here instead
                    parent,
                    null,
                    color,
                );
            }

            // send the user back to home screen
            returnHome();

        // if creating and adding the event failed, show an error message on the next render
        } catch (e) {
            console.error(e);
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
            color,
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
                    hide={false}
                />

                <ColorSelect
                    name="color"
                    value={color}
                    onChange={this.handleInputChange}
                />

            </InputForm>
        );
    }
}

// maps the state settings to the redux store settings
const mapStateToProps = state => (
    {
        events: state.events.events,
    }
);

export default connect(mapStateToProps, { editEvent })(EditEventForm);
