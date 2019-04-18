import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import InputForm from './InputForm';
import {
    NameInput,
    DescriptionInput,
    StartEndInput,
    LocationInput,
    UseLocationInput,
    NumberInput,
} from './InputFormComponents';
import '../../styles/StandardEventForm.css';
import { Deadline } from '../events/Deadline';
import DateErrorMessage from './ErrorMessage';
import { createDeadlineEvent } from '../actions/createEvent';
import Settings from '../events/Settings';

/**
 * Class to handle gathering input form the user to create a Deadline object
 */
class DeadlineForm extends React.Component {
    /**
     * Creates the form to get the input for the deadline event.
     * @param {func} props.returnHome    function to send the user back to the home screen
     * @param {func} createDeadlineEvent function to add the deadline event to the redux store
     */
    constructor(props) {
        super(props);
        this.state = {
            title: 'Deadline Form',
            name: '',
            description: '',
            taskStart: moment(),
            taskDeadline: moment().add(props.settings.timeBeforeDue, 'hour'),
            location: props.settings.defaultLocation,
            useLocation: false,
            minTime: props.settings.minWorkTime,
            maxTime: props.settings.maxWorkTime,
            minBreak: props.settings.minBreakTime,
            totalTime: props.settings.timeToComplete,
            error: false,
            errorMsg: 'No Error',
        };

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
            createDeadlineEvent: PropTypes.func.isRequired,
            settings: PropTypes.instanceOf(Settings).isRequired,
        };
    }

    /**
     * Updates the state with the change to the input form the user made
     * @param {obj} event the event object that stores the change the user made
     */
    handleInputChange(event) {
        // if the event was triggered by a checkbox, get the checked value, otherwise use the value
        const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const inputName = event.target.name;

        // update the state
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
            taskStart: time,
        });
    }

    /**
     * Updates the state with the change the user made to the end date
     * @param {obj} event the event object that stores the change the user made
     */
    handleEndDateChange(time) {
        this.setState({
            taskDeadline: time,
        });
    }

    /**
     * Creates the Deadline object, adds it to the redux store, and returns to the home screen
     * @param {obj} event the event object that stores the event that called this function
     */
    handleSubmit(event) {
        event.preventDefault();

        const {
            name,
            description,
            taskStart,
            taskDeadline,
            location,
            useLocation,
            minTime,
            maxTime,
            minBreak,
            totalTime,
        } = this.state;

        const {
            returnHome,
        } = this.props;

        // try to create the deadline object
        try {
            const deadline = new Deadline(
                name,
                description,
                taskDeadline,
                totalTime,
                minTime,
                maxTime,
                minBreak,
                taskStart,
                location,
                useLocation,
            );

            // add the deadline event to the calendar
            // eslint-disable-next-line react/destructuring-assignment
            this.props.createDeadlineEvent(deadline);

            returnHome();
        // if there was an error creating the deadline object, display it to the user.
        } catch (e) {
            console.error(e);
            this.setState({
                error: true,
                errorMsg: e.message,
            });
        }
    }

    /**
     * Loads the correct input form
     */
    render() {
        const { returnHome } = this.props;
        const {
            title,
            name,
            description,
            taskStart,
            taskDeadline,
            location,
            useLocation,
            minTime,
            maxTime,
            minBreak,
            totalTime,
            error,
            errorMsg,
        } = this.state;

        // generate the input form based on the Deadline input form in the design doc
        return (
            <InputForm
                onSubmit={this.handleSubmit}
                onBack={returnHome}
                title={title}
            >
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
                    start={taskStart}
                    end={taskDeadline}
                    startDescription="Task Start Time"
                    endDescription="Task Deadline"
                    onStartChange={this.handleStartDateChange}
                    onEndChange={this.handleEndDateChange}
                />
                <LocationInput
                    name="location"
                    value={location}
                    onChange={this.handleInputChange}
                />
                <UseLocationInput
                    name="useLocation"
                    checked={useLocation}
                    onChange={this.handleInputChange}
                />
                <NumberInput
                    name="minTime"
                    value={minTime}
                    description="Min Scheduled Event Time"
                    onChange={this.handleInputChange}
                >
                    in Minutes
                </NumberInput>
                <NumberInput
                    name="maxTime"
                    value={maxTime}
                    description="Max Scheduled Event Time"
                    onChange={this.handleInputChange}
                >
                    in Minutes
                </NumberInput>
                <NumberInput
                    name="minBreak"
                    value={minBreak}
                    description="Min Time Between Events"
                    onChange={this.handleInputChange}
                >
                    in Minutes
                </NumberInput>
                <NumberInput
                    name="totalTime"
                    value={totalTime}
                    description="Total Time to Complete"
                    onChange={this.handleInputChange}
                >
                    in Minutes
                </NumberInput>
            </InputForm>
        );
    }
}

// maps state to settings from redux store
const mapStateToProps = state => (
    {
        settings: state.settings.settings,
    }
);

export default connect(mapStateToProps, { createDeadlineEvent })(DeadlineForm);
