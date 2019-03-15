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
        FreqEnum,
        NotificationEnum} from './EventFormComponents'
import EventForm from './EventForm'
import '../styles/StandardInputForm.css';

class StandardEventForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: (this.props.title) ? this.props.title : "Standard Event Form",
            name: "",
            description: "",
            eventStart: moment(),
            eventEnd: moment().add(1, 'hour'),
            location: "",
            frequency: null,
            notifications: NotificationEnum.NONE,
            notificationTime: "",
            locked: true,
        }

        this.frequencySelectChange = this.frequencySelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.returnHome = this.returnHome.bind(this);
    }

    frequencySelectChange(event) {
        this.setState({frequency: event.target.value});

        if (event.target.value == FreqEnum.CUSTOM) {
            alert("TODO: open custom choice menu");
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
            eventStart: time
        })
    }

    handleEndDateChange(time) {
        this.setState({
            eventEnd: time
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
            Frequency:         ${this.state.frequency}
            Notifications:     ${this.state.notifications}
            Notification Time: ${this.state.notificationTime}
            Locked:            ${this.state.locked}
        `);
        event.preventDefault();
    }

    returnHome(event) {
        alert("TODO: return to home screen")
    }

    render() {
        return (
            <EventForm onSubmit={this.handleSubmit} onBack={this.returnHome} title={this.state.title}>
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
                    start={this.state.eventStart}
                    end={this.state.eventEnd}
                    startDescription="Event Start Time"
                    endDescription="Event End Time"
                    onStartChange={this.handleStartDateChange}
                    onEndChange={this.handleEndDateChange}
                />
                <LocationInput
                    name="location"
                    value={this.state.location}
                    onChange={this.handleInputChange}
                />
                <FrequencySelect
                    name="frequency"
                    value={this.state.frequency}
                    onChange={this.frequencySelectChange}
                />
                <NotificationSelect
                    name="notifications"
                    value={this.state.notifications}
                    onChange={this.handleInputChange}
                />
                <NotificationTime
                    name="notificationTime"
                    value={this.state.notificationTime}
                    onChange={this.handleInputChange}
                />
                {!this.props.hideLock && <LockEventInput
                    name="locked"
                    checked={this.state.locked}
                    onChange={this.handleInputChange}
                />}
            </EventForm>
        )
    }
}

export default StandardEventForm