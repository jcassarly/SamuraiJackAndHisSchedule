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
        NumberInput,
        TextInput,
        CheckboxInput,
        SelectInput,
        FreqEnum,
        NotificationEnum} from './InputFormComponents'
import InputForm from './InputForm'
import '../styles/SettingsForm.css';

function SettingsSection(props) {
    return (
        <div class="sectionBorder">
            <label class="titleLine">
                <i>{props.title}</i>
            </label>
            <div>
                {props.children}
            </div>
        </div>
    )
}

class SettingsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "General Settings",
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
            <InputForm onSubmit={this.handleSubmit} onBack={this.returnHome} title={this.state.title}>
                <SettingsSection title="Home Screen">
                    <NumberInput
                        name="snapToGrid"
                        value={this.state.snapToGrid}
                        description="Snap to Grid"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>Length of time to be used when moving events on the Calendar</div>
                    </NumberInput>
                </SettingsSection>

                <SettingsSection title="Auto-Scheduler">
                    <NumberInput
                        name="minBreak"
                        value={this.state.minBreak}
                        description="Min Break Time"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>Minimum period of time between events created by the Auto-Scheduler.</div>
                    </NumberInput>
                    <NumberInput
                        name="minTime"
                        value={this.state.minTime}
                        description="Min Event Time"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>Minimum time of an event created by the Auto-Scheduler.</div>
                    </NumberInput>
                    <NumberInput
                        name="maxTime"
                        value={this.state.maxTime}
                        description="Max Event Time"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>Maximum time of an event created by the Auto-Scheduler.</div>
                    </NumberInput>
                </SettingsSection>

                <SettingsSection title="Language">
                    <SelectInput
                        prompt="Default Language"
                        name="language"
                        value={this.state.language}
                        onChange={this.handleInputChange}
                    >
                        <option value="English">English</option>
                    </SelectInput>
                </SettingsSection>

                <SettingsSection title="Events">
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
                    <NumberInput
                        name="duration"
                        value={this.state.duration}
                        description="Event Duration"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>Default duration when creating a single event.</div>
                    </NumberInput>
                    <LocationInput
                        name="location"
                        value={this.state.location}
                        onChange={this.handleInputChange}
                    />
                </SettingsSection>
            </InputForm>
        )
    }
}

export default SettingsForm