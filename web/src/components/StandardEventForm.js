import React from 'react';
import DateTime from 'react-datetime';
import moment from 'moment'

import '../styles/StandardInputForm.css';

var FreqEnum = {
    ONETIME: "One Time",
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
    CUSTOM: "Custom",
}

var NotificationEnum = {
    NONE: "None",
    EMAIL: "Email",
    TEXT: "Text Message",
    BANNER: "Banner Notification",
    PUSH: "Push Notification",
}

class StandardEventForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Standard Event Form",
            name: "",
            description: "",
            eventStart: moment(),
            eventEnd: moment().add(1, 'hour'),
            location: "",
            frequency: FreqEnum.ONETIME,
            notifications: NotificationEnum.NONE,
            notificationTime: "",
            locked: true,
        }

        this.frequencySelectChange = this.frequencySelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        //event.preventDefault();
    }

    render() {
        return (
            <div overflow="scroll">
                <center>
                    <label>
                        <h3>{this.state.title}</h3>
                    </label>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <input type="text"
                                   name="name"
                                   value={this.state.name}
                                   placeHolder="Event Name"
                                   onChange={this.handleInputChange}
                            />
                        </div>
                        <div>
                            <input type="text"
                                   name="description"
                                   value={this.state.description}
                                   placeHolder="Event Description"
                                   onChange={this.handleInputChange}
                            />
                        </div>
                        <div class="center">
                            <div class="left">
                                <DateTime inputProps={{placeHolder: "Event Start Time",}}
                                          value={this.state.eventStart}
                                          onChange={this.handleStartDateChange}
                                />
                            </div>
                            <div class="left">
                                <DateTime inputProps={{placeHolder: "Event End Time",}}
                                          value={this.state.eventEnd}
                                          onChange={this.handleEndDateChange}
                                />
                            </div>
                        </div>
                        <div>
                            <input type="text"
                                   name="location"
                                   value={this.state.location}
                                   placeHolder="Event Location"
                                   onChange={this.handleInputChange}
                            />
                        </div>
                        <div>
                            <label>
                                Event Frequency:
                            </label>
                            <select value={this.state.notifications} onChange={this.handleInputChange}>
                                <option value={NotificationEnum.NONE}>{NotificationEnum.NONE}</option>
                                <option value={NotificationEnum.EMAIL}>{NotificationEnum.EMAIL}</option>
                                <option value={NotificationEnum.TEXT}>{NotificationEnum.TEXT}</option>
                                <option value={NotificationEnum.BANNER}>{NotificationEnum.BANNER}</option>
                                <option value={NotificationEnum.PUSH}>{NotificationEnum.PUSH}</option>
                            </select>
                        </div>
                        <div>
                            <label>
                                Notification Type:
                                <select value={this.state.frequency} onChange={this.frequencySelectChange}>
                                    <option value={FreqEnum.ONETIME}>{FreqEnum.ONETIME}</option>
                                    <option value={FreqEnum.DAILY}>{FreqEnum.DAILY}</option>
                                    <option value={FreqEnum.WEEKLY}>{FreqEnum.WEEKLY}</option>
                                    <option value={FreqEnum.MONTHLY}>{FreqEnum.MONTHLY}</option>
                                    <option value={FreqEnum.YEARLY}>{FreqEnum.YEARLY}</option>
                                    <option value={FreqEnum.CUSTOM}>{FreqEnum.CUSTOM}</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <input type="number"
                                   name="notificationTime"
                                   value={this.state.notificationTime}
                                   placeHolder="Notification Time"
                                   onChange={this.handleInputChange}
                            />
                        </div>
                        <div>
                            <label>
                                Lock Event: <input type="checkbox"
                                                   name="locked"
                                                   checked={this.state.locked}
                                                   onChange={this.handleInputChange}
                                            />
                            </label>
                        </div>
                        <div>
                            <input type="submit" value="Submit" />
                        </div>
                    </form>
                </center>
            </div>
        )
    }
}

export default StandardEventForm