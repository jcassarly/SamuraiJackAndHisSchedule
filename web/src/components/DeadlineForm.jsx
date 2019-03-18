import React from 'react';
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
        this.returnHome = this.returnHome.bind(this);
    }

    static get propTypes() {
        return {
            returnHome: PropTypes.func.isRequired,
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
        alert(`
            Adding a new standard event with the following info:
            Name:              ${this.state.name}
            Description:       ${this.state.description}
            Start Time:        ${this.state.eventStart}
            End Time:          ${this.state.eventEnd}
            Location:          ${this.state.location}
            Use Location:      ${this.state.useLocation}
            Min Time:          ${this.state.minTime}
            Max Time:          ${this.state.maxTime}
            Min Break Time:    ${this.state.minBreak}
            Total Time:        ${this.state.totalTime}
        `);
        event.preventDefault();
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
                    in Hours
                </NumberInput>
                <NumberInput
                    name="maxTime"
                    value={maxTime}
                    description="Max Scheduled Event Time"
                    onChange={this.handleInputChange}
                >
                    in Hours
                </NumberInput>
                <NumberInput
                    name="minBreak"
                    value={minBreak}
                    description="Min Time Between Events"
                    onChange={this.handleInputChange}
                >
                    in Hours
                </NumberInput>
                <NumberInput
                    name="totalTime"
                    value={totalTime}
                    description="Total Time to Complete"
                    onChange={this.handleInputChange}
                >
                    in Hours
                </NumberInput>
            </InputForm>
        );
    }
}

export default DeadlineForm;
