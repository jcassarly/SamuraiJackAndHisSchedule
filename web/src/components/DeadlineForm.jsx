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
import '../styles/StandardEventForm.css';
import Deadline from '../events/Deadline';

class DeadlineForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Deadline Form',
            name: '',
            description: '',
            taskStart: moment(),
            taskDeadline: moment().add(1, 'hour'),
            location: '',
            useLocation: true,
            minTime: 0,
            maxTime: 0,
            minBreak: 0,
            totalTime: 0,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static get propTypes() {
        return {
            returnHome: PropTypes.func.isRequired,
            // eslint-disable-next-line react/forbid-prop-types
            events: PropTypes.object.isRequired,
        };
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
            taskStart: time,
        });
    }

    handleEndDateChange(time) {
        this.setState({
            taskDeadline: time,
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const {
            name,
            description, // eslint-disable-line 
            taskStart,
            taskDeadline,
            location,
            useLocation, // eslint-disable-line
            minTime,
            maxTime,
            minBreak,
            totalTime,
        } = this.state;

        const {
            returnHome,
        } = this.props;

        const deadline = new Deadline(
            name,
            // TODO: add description to deadline
            taskDeadline,
            totalTime,
            minTime,
            maxTime,
            minBreak,
            taskStart,
            location,
            // TODO: add uselocation to deadline
        );

        // eslint-disable-next-line no-alert
        alert(`
            Adding a new standard event with the following info:
            Name:              ${deadline.name}
            Description:       TODO
            Task Start:        ${deadline.startWorkTime}
            Task Deadline:     ${deadline.deadline}
            Location:          ${deadline.location}
            Use Location:      TODO
            Min Time:          ${deadline.minEventTime}
            Max Time:          ${deadline.maxEventTime}
            Min Break Time:    ${deadline.minBreak}
            Total Time:        ${deadline.totalWorkTime}
        `);

        // eslint-disable-next-line react/destructuring-assignment
        Object.values(this.props.events).forEach((e) => {
            alert(e.toString());
        });

        // call the autoscheduler to get the new calendar

        // set the calendar to the new event list created by the autoscheduler

        returnHome();
    }

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
        } = this.state;

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

const mapStateToProps = state => (
    {
        events: state.events.events,
    }
);

export default connect(mapStateToProps)(DeadlineForm);
