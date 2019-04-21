import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    LocationInput,
    NotificationSelect,
    NotificationTime,
    NumberInput,
    SelectInput,
} from './InputFormComponents';
import InputForm from '../../components/InputForm';
import BaseElem from '../../components/BaseElem';
import SettingsSection from '../../components/SettingsSection';
import FormHelper from '../../components/FormHelper';
import { Settings } from '../events/Settings';
import { updateSettings } from '../actions/updateSettings';

/**
 * React Component that handles input gathering for the general settings of the app
 */
class SettingsForm extends React.Component {
    /**
     * Creates the form used to change the user settings of the app
     * @param {returnHome} props.returnHome a function to send the user back to the homescreen
     */
    constructor(props) {
        super(props);

        // get the default settings
        this.state = {
            title: 'General Settings',
            location: props.settings.defaultLocation,
            notifications: props.settings.defaultNotificationType,
            notificationTime: props.settings.defaultNotificationTimeBefore,
            snapToGrid: props.settings.snapToGrid,
            minBreak: props.settings.minBreakTime,
            minTime: props.settings.minWorkTime,
            maxTime: props.settings.maxWorkTime,
            language: props.settings.language,
            duration: props.settings.eventLength,
            timeBeforeDue: props.settings.timeBeforeDue,
            timeToComplete: props.settings.timeToComplete,
        };

        console.log(props.settings);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Gets the required types for the props passed into the constructor
     */
    static get propTypes() {
        return {
            returnHome: PropTypes.func.isRequired,
            updateSettings: PropTypes.func.isRequired,
            settings: PropTypes.instanceOf(Settings).isRequired,
        };
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
     * Updates the Settings object, changes to the redux store, and returns to the home screen
     * @param {obj} event the event object that stores the event that called this function
     */
    handleSubmit(...args) {
        FormHelper.prevDef(...args);
        const {
            location,
            notifications,
            notificationTime,
            snapToGrid,
            minBreak,
            minTime,
            maxTime,
            language,
            duration,
            timeBeforeDue,
            timeToComplete,
        } = this.state;

        const {
            returnHome,
        } = this.props;

        // attempt to create the new event and add it to the redux store
        let sett = null;
        // create a Settings object
        sett = Settings.createSettingsfromInfo(
            duration,
            location,
            notifications,
            notificationTime,
            true,
            language,
            snapToGrid,
            timeBeforeDue,
            minTime,
            maxTime,
            minBreak,
            timeToComplete,
        );

        // add the Settings to the redux store
        // eslint-disable-next-line react/destructuring-assignment
        this.props.updateSettings(sett);

        // send the user back to home screen
        returnHome();
    }

    /**
     * Loads the input form
     */
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

        const langOptions = [
            { value: 'English', contents: 'English' },
        ];

        // generate the input form based on the Settings input form in the design doc
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
                        <BaseElem>
                            Length of time to be used when moving events on the Calendar
                        </BaseElem>
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
                        <BaseElem>
                            Minimum period of time between events created by the Auto-Scheduler.
                        </BaseElem>
                    </NumberInput>
                    <NumberInput
                        name="minTime"
                        value={minTime}
                        description="Min Event Time"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <BaseElem>
                            Minimum time of an event created by the Auto-Scheduler.
                        </BaseElem>
                    </NumberInput>
                    <NumberInput
                        name="maxTime"
                        value={maxTime}
                        description="Max Event Time"
                        onChange={this.handleInputChange}
                    >
                        in Minutes
                        <BaseElem>
                            Maximum time of an event created by the Auto-Scheduler.
                        </BaseElem>
                    </NumberInput>
                    <NumberInput
                        name="timeBeforeDue"
                        value={timeBeforeDue}
                        description="Time Before Due"
                        onChange={this.handleInputChange}
                    >
                        in Hours
                        <BaseElem>
                            Default amount of time before a task is due when using Auto-Scheduler
                        </BaseElem>
                    </NumberInput>
                    <NumberInput
                        name="timeToComplete"
                        value={timeToComplete}
                        description="Time to Complete"
                        onChange={this.handleInputChange}
                    >
                        in Hours
                        <BaseElem>
                            Default total work time to complete a task used by the Auto-Scheduler
                        </BaseElem>
                    </NumberInput>
                </SettingsSection>

                <SettingsSection title="Language">
                    <SelectInput
                        prompt="Default Language"
                        name="language"
                        value={language}
                        onChange={this.handleInputChange}
                        options={langOptions}
                    />
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
                        <BaseElem>
                            Default duration when creating a single event.
                        </BaseElem>
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

// maps the state settings to the redux store settings
const mapStateToProps = state => (
    {
        settings: state.settings.settings,
    }
);

export default connect(mapStateToProps, { updateSettings })(SettingsForm);
