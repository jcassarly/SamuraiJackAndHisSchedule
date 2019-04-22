import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ColorEnum from '../ColorEnum';
import Frequency from '../events/Frequency';
import Notifications from '../events/Notifications';
import {
    BaseInput,
    StartEndInput,
    SelectInput,
} from '../../components/InputFormComponents';

/**
 * Create a React Component that gets text input from the user
 * @param {string} props.description the description of the input to gather
 * @param {string} props.name        the name of the input field
 * @param {string} props.value       the value stored in the input field
 * @param {func}   props.onChange    a function to handle changes to the input field
 * @param {node}   props.children    Extra text to show after the input field for
 *                                   further directions for the user
 */
function TextInput(props) {
    const {
        description,
        name,
        value,
        onChange,
        children,
    } = props;
    return (
        <BaseInput
            type="text"
            name={name}
            value={value}
            description={description}
            onChange={onChange}
        >
            {children}
        </BaseInput>
    );
}

// defines the object that checks the props passed into the TextInput
TextInput.propTypes = {
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

// defines the object that specified the default values for non-required props
TextInput.defaultProps = {
    children: null,
};

/**
 * Create a React Component that gets numeric input from the user
 * @param {string} props.description the description of the input to gather
 * @param {string} props.name        the name of the input field
 * @param {number} props.value       the value stored in the input field
 * @param {func}   props.onChange    a function to handle changes to the input field
 * @param {node}   props.children    Extra text to show after the input field for
 *                                   further directions for the user
 */
function NumberInput(props) {
    const {
        description,
        name,
        value,
        onChange,
        children,
    } = props;
    return (
        <BaseInput
            type="number"
            name={name}
            value={value}
            description={description}
            onChange={onChange}
        >
            {children}
        </BaseInput>
    );
}

// defines the object that checks the props passed into the NumberInput
NumberInput.propTypes = {
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

// defines the object that specified the default values for non-required props
NumberInput.defaultProps = {
    children: null,
};

/**
 * Create a React Component that get boolean input from the user
 * @param {string} props.description the description of the input to gather
 * @param {string} props.name        the name of the input field
 * @param {bool}   props.checked     whether or not the input field is checked
 * @param {func}   props.onChange    a function to handle changes to the input field
 * @param {node}   props.children    Extra text to show after the input field for
 *                                   further directions for the user
 */
function CheckboxInput(props) {
    const {
        description,
        name,
        checked,
        onChange,
        children,
    } = props;
    return (
        <BaseInput
            type="checkbox"
            name={name}
            checked={checked}
            description={description}
            onChange={onChange}
        >
            {children}
        </BaseInput>
    );
}

// defines the object that checks the props passed into the CheckboxInput
CheckboxInput.propTypes = {
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

// defines the object that specified the default values for non-required props
CheckboxInput.defaultProps = {
    children: null,
};

/**
 * Create a React Component that gets an event name from the user
 * @param {string} props.name        the name of the input field
 * @param {string} props.value       the value stored in the input field
 * @param {func}   props.onChange    a function to handle changes to the input field
 */
function NameInput(props) {
    const {
        name,
        value,
        onChange,
    } = props;
    return (
        <TextInput
            name={name}
            value={value}
            description="Event Name"
            onChange={onChange}
        />
    );
}

// defines the object that checks the props passed into the NameInput
NameInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

/**
 * Create a React Component that gets an event description from the user
 * @param {string} props.name        the name of the input field
 * @param {string} props.value       the value stored in the input field
 * @param {func}   props.onChange    a function to handle changes to the input field
 */
function DescriptionInput(props) {
    const {
        name,
        value,
        onChange,
    } = props;
    return (
        <TextInput
            name={name}
            value={value}
            description="Event Description"
            onChange={onChange}
        />
    );
}

// defines the object that checks the props passed into the DescriptionInput
DescriptionInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

// defines the object that checks the props passed into the StartEndInput
StartEndInput.propTypes = {
    startDescription: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(moment).isRequired,
    onStartChange: PropTypes.func.isRequired,

    endDescription: PropTypes.string.isRequired,
    end: PropTypes.instanceOf(moment).isRequired,
    onEndChange: PropTypes.func.isRequired,
};

/**
 * Create a React Component that gets an event location from the user
 * @param {string} props.name        the name of the input field
 * @param {string} props.value       the value stored in the input field
 * @param {func}   props.onChange    a function to handle changes to the input field
 */
function LocationInput(props) {
    const {
        name,
        value,
        onChange,
    } = props;
    return (
        <TextInput
            name={name}
            value={value}
            description="Event Location"
            onChange={onChange}
        />
    );
}

// defines the object that checks the props passed into the LocationInput
LocationInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

/**
 * Create a React Component that gets a selection from a list of notification types
 * @param {string} props.name     the name of the React Component
 * @param {string} props.value    the selection
 * @param {func}   props.onChange a function to handle changes to the input field
 */
function NotificationSelect(props) {
    const {
        name,
        value,
        onChange,
    } = props;
    // a list of value content pairs to display the options to the user
    const options = [
        { value: '', contents: 'None' },
        { value: Notifications.noteEnum.EMAIL, contents: 'Email' },
        { value: Notifications.noteEnum.TEXT, contents: 'Text Message' },
        { value: Notifications.noteEnum.BANNER, contents: 'Banner' },
        { value: Notifications.noteEnum.PUSH, contents: 'Push' },
    ];

    return (
        <SelectInput
            prompt="Notification Type"
            name={name}
            value={value}
            onChange={onChange}
            options={options}
        />
    );
}

// defines the object that checks the props passed into the NotificationSelect
NotificationSelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

// defines the object that specified the default values for non-required props
NotificationSelect.defaultProps = {
    value: '',
};

/**
 * Create a React Component that gets a selection from a list of frequency types
 * @param {string} props.name     the name of the React Component
 * @param {string} props.value    the selection
 * @param {func}   props.onChange a function to handle changes to the input field
 */
function FrequencySelect(props) {
    const {
        name,
        value,
        onChange,
    } = props;
    const options = [
        { value: '', contents: 'One Time' },
        { value: Frequency.freqEnum.DAILY, contents: 'Daily' },
        { value: Frequency.freqEnum.WEEKLY, contents: 'Weekly' },
        { value: Frequency.freqEnum.MONTHLY, contents: 'Monthly' },
        { value: Frequency.freqEnum.YEARLY, contents: 'Yearly' },
        { value: Frequency.freqEnum.CUSTOM, contents: 'Custom' },
    ];

    return (
        <SelectInput
            prompt="Event Frequency"
            name={name}
            value={value}
            onChange={onChange}
            options={options}
        />
    );
}

// defines the object that checks the props passed into the FrequencySelect
FrequencySelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

// defines the object that specified the default values for non-required props
FrequencySelect.defaultProps = {
    value: '',
};

/**
 * Create a React Component that gets numeric input from the user
 * @param {string} props.name        the name of the input field
 * @param {number} props.value       the value stored in the input field
 * @param {func}   props.onChange    a function to handle changes to the input field
 */
function NotificationTime(props) {
    const {
        name,
        value,
        onChange,
    } = props;
    return (
        <NumberInput
            name={name}
            value={value}
            description="Notification Time"
            onChange={onChange}
        />
    );
}

// defines the object that checks the props passed into the NotificationTime
NotificationTime.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

/**
 * Create a React Component that gets whether an event should be locked or not
 * @param {string} props.name        the name of the input field
 * @param {bool}   props.checked     whether or not the input field is checked
 * @param {func}   props.onChange    a function to handle changes to the input field
 */
function LockEventInput(props) {
    const {
        name,
        checked,
        onChange,
        hide,
    } = props;

    // if the field should be hiden, return null
    let retval = null;

    // otherwise return the JSX object that gets boolean input
    if (hide === false) {
        retval = (
            <CheckboxInput
                name={name}
                checked={checked}
                description="Lock Event"
                onChange={onChange}
            />
        );
    }

    return retval;
}

// defines the object that checks the props passed into the LockEventInput
LockEventInput.propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    hide: PropTypes.bool.isRequired,
};

/**
 * Create a React Component that gets whether location should be used or not
 * @param {string} props.name        the name of the input field
 * @param {bool}   props.checked     whether or not the input field is checked
 * @param {func}   props.onChange    a function to handle changes to the input field
 */
function UseLocationInput(props) {
    const {
        name,
        checked,
        onChange,
    } = props;
    return (
        <CheckboxInput
            name={name}
            checked={checked}
            description="Use Location"
            onChange={onChange}
        />
    );
}

// defines the object that checks the props passed into the UseLocationInput
UseLocationInput.propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

/**
 * Create a React Component that gets a selection from a list of color schemes
 * @param {string} props.name     the name of the React Component
 * @param {string} props.value    the selection
 * @param {func}   props.onChange a function to handle changes to the input field
 */
function ColorSelect(props) {
    const {
        name,
        value,
        onChange,
    } = props;
    const options = [
        { value: ColorEnum.BLUE_BLACK, contents: 'Blue + Black Text' },
        { value: ColorEnum.BLACK_WHITE, contents: 'Black + White Text' },
        { value: ColorEnum.GREEN_BLACK, contents: 'Green + Black Text' },
        { value: ColorEnum.ORANGE_BLACK, contents: 'Orange + Black Text' },
        { value: ColorEnum.INDIGO_WHITE, contents: 'Indigo + White Text' },
        { value: ColorEnum.YELLOW_BLACK, contents: 'Yellow + Black Text' },
        { value: ColorEnum.RED_WHITE, contents: 'Red + White Text' },
    ];

    return (
        <SelectInput
            prompt="Color Scheme"
            name={name}
            value={value}
            onChange={onChange}
            options={options}
        />
    );
}

// defines the object that checks the props passed into the NotificationSelect
ColorSelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
};

// defines the object that specified the default values for non-required props
ColorSelect.defaultProps = {
    value: '',
};

export {
    NameInput,
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
    SelectInput,
    CheckboxInput,
    ColorSelect,
};
