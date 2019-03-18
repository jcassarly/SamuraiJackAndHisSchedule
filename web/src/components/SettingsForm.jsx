import React from 'react';
import PropTypes from 'prop-types';
import {
    LocationInput,
    NotificationSelect,
    NotificationTime,
    NumberInput,
    SelectInput,
} from './InputFormComponents';
import InputForm from './InputForm';
import Frequency from '../events/Frequency';
import Settings from '../events/Settings';
import '../styles/SettingsForm.css';

function SettingsSection(props) {
    const {
        title,
        children,
    } = props;
    return (
        <div className="sectionBorder">
            <div className="titleLine">
                <i>{title}</i>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

SettingsSection.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

class SettingsForm extends React.Component {
    constructor(props) {
        super(props);

        const defaults = new Settings();
        this.state = {
            title: 'General Settings',
            location: defaults.defaultLocation,
            notifications: defaults.defaultNotificationType,
            notificationTime: defaults.defaultNotificationTimeBefore,
            snapToGrid: defaults.defaultSnapToGrid,
            minBreak: defaults.minBreakTime,
            minTime: defaults.minWorkTime,
            maxTime: defaults.maxWorkTime,
            language: defaults.defaultLanguage,
            duration: defaults.eventLength,
            timeBeforeDue: defaults.timeBeforeDue,
            timeToComplete: defaults.timeToComplete,
        };

        this.frequencySelectChange = this.frequencySelectChange.bind(this);
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

    render() {
        const {
            returnHome,
        } = this.props;

        const {
            title,
            snapToGrid,
            location,
            notifications,
            notificationTime,
            minBreak,
            minTime,
            maxTime,
            language,
            duration,
            timeBeforeDue,
            timeToComplete,
        } = this.state;

        return (
            <InputForm onSubmit={this.handleSubmit} onBack={returnHome} title={title}>
                <SettingsSection title="Home Screen">
                    <NumberInput
                        name="snapToGrid"
                        value={snapToGrid}
                        description="Snap to Grid"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>
                            Length of time to be used when moving events on the Calendar
                        </div>
                    </NumberInput>
                </SettingsSection>

                <SettingsSection title="Auto-Scheduler">
                    <NumberInput
                        name="minBreak"
                        value={minBreak}
                        description="Min Break Time"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>
                            Minimum period of time between events created by the Auto-Scheduler.
                        </div>
                    </NumberInput>
                    <NumberInput
                        name="minTime"
                        value={minTime}
                        description="Min Event Time"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>
                            Minimum time of an event created by the Auto-Scheduler.
                        </div>
                    </NumberInput>
                    <NumberInput
                        name="maxTime"
                        value={maxTime}
                        description="Max Event Time"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>
                            Maximum time of an event created by the Auto-Scheduler.
                        </div>
                    </NumberInput>
                    <NumberInput
                        name="timeBeforeDue"
                        value={timeBeforeDue}
                        description="Time Before Due"
                        onChange={this.handleInputChange}
                    >
                        in Hours
                        <div>
                            Default amount of time before a task is due when using Auto-Scheduler
                        </div>
                    </NumberInput>
                    <NumberInput
                        name="timeToComplete"
                        value={timeToComplete}
                        description="Time to Complete"
                        onChange={this.handleInputChange}
                    >
                        in Hours
                        <div>
                            Default total work time to complete a task used by the Auto-Scheduler
                        </div>
                    </NumberInput>
                </SettingsSection>

                <SettingsSection title="Language">
                    <SelectInput
                        prompt="Default Language"
                        name="language"
                        value={language}
                        onChange={this.handleInputChange}
                    >
                        <option value="English">English</option>
                    </SelectInput>
                </SettingsSection>

                <SettingsSection title="Events">
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
                    <NumberInput
                        name="duration"
                        value={duration}
                        description="Event Duration"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <div>Default duration when creating a single event.</div>
                    </NumberInput>
                    <LocationInput
                        name="location"
                        value={location}
                        onChange={this.handleInputChange}
                    />
                </SettingsSection>
            </InputForm>
        );
    }
}

export default SettingsForm;
