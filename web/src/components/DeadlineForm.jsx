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
        UseLocationInput,
        NumberInput,
        TextInput,
        CheckboxInput,
        NotificationEnum,} from './InputFormComponents'
import InputForm from './InputForm'
import '../styles/StandardEventForm.css';

class DeadlineForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Deadline Form",
            name: "",
            description: "",
            eventStart: moment(),
            eventEnd: moment().add(1, 'hour'),
            location: "",
            useLocation: true,
            minTime: 0,
            maxTime: 0,
            minBreak: 0,
            totalTime: 0,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.returnHome = this.returnHome.bind(this);
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
            taskStart: time
        })
    }

    handleEndDateChange(time) {
        this.setState({
            taskDeadline: time
        })
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
        return (
            <InputForm onSubmit={this.handleSubmit} onBack={this.props.returnHome} title={this.state.title}>
                <NameInput
                    name="name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                />
                <DescriptionInput
                    name="description"
                    value={this.state.description}
                    onChange={this.handleInputChange}
                />
                <StartEndInput
                    start={this.state.taskStart}
                    end={this.state.taskDeadline}
                    startDescription="Task Start Time"
                    endDescription="Task Deadline"
                    onStartChange={this.handleStartDateChange}
                    onEndChange={this.handleEndDateChange}
                />
                <LocationInput
                    name="location"
                    value={this.state.location}
                    onChange={this.handleInputChange}
                />
                <UseLocationInput
                    name="useLocation"
                    checked={this.state.useLocation}
                    onChange={this.handleInputChange}
                />
                <NumberInput
                    name="minTime"
                    value={this.state.minTime}
                    description="Min Scheduled Event Time"
                    onChange={this.handleInputChange}
                >
                    in Hours
                </NumberInput>
                <NumberInput
                    name="maxTime"
                    value={this.state.maxTime}
                    description="Max Scheduled Event Time"
                    onChange={this.handleInputChange}
                >
                    in Hours
                </NumberInput>
                <NumberInput
                    name="minBreak"
                    value={this.state.minBreak}
                    description="Min Time Between Events"
                    onChange={this.handleInputChange}
                >
                    in Hours
                </NumberInput>
                <NumberInput
                    name="totalTime"
                    value={this.state.totalTime}
                    description="Total Time to Complete"
                    onChange={this.handleInputChange}
                >
                    in Hours
                </NumberInput>
            </InputForm>
        )
    }
}

export default DeadlineForm