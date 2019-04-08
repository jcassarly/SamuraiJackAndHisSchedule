import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'react-datetime';
import Frequency from '../events/Frequency';
import Notifications from '../events/Notifications';

import '../styles/StandardEventForm.css';
import '../styles/InputFields.css';

/**
 * Create a React Component that contains a text and input field
 * @param {string} props.description the description of the input to gather
 * @param {string} props.type        the type of input to gather
 * @param {string} props.name        the name of the input field
 * @param {any}    props.value       the value stored in the input field
 * @param {bool}   props.checked     whether or not the input field is checked
 * @param {func}   props.onChange    a function to handle changes to the input field
 * @param {node}   props.children    Extra text to show after the input field for
 *                                   further directions for the user
 */
function BaseInput(props) {
    const {
        description,
        type,
        name,
        value,
        checked,
        onChange,
        children,
    } = props;
    return (
        <div className="baseBorder">
            {description}
            {': '}
            <input
                type={type}
                name={name}
                value={value}
                checked={checked}
                placeholder={description}
                onChange={onChange}
            />
            {children}
        </div>
    );
}

// defines the object that checks the props passed into the BaseInput
BaseInput.propTypes = {
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

// defines the object that specified the default values for non-required props
BaseInput.defaultProps = {
    value: undefined,
    checked: false,
    children: null,
};

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

/**
 * Create a react component that gets a start and end time from a user
 * @param {string} props.startDescription The description of the start time
 * @param {moment} props.start            The object that stores the start time
 * @param {func}   props.onStartChange    The function that handles changes to the start input
 * @param {string} props.endDescription   The description of the end time
 * @param {moment} props.end              The object that stores the end time
 * @param {func}   props.onEndChange      The function that handles changes to the end input
 */
function StartEndInput(props) {
    const {
        startDescription,
        start,
        onStartChange,

        endDescription,
        end,
        onEndChange,
    } = props;
    return (
        <div className="baseBorder">
            <div className="center">
                <div className="left">
                    <div>
                        {startDescription}
                    </div>
                    <DateTime
                        inputProps={{ placeholder: startDescription }}
                        value={start}
                        onChange={onStartChange}
                    />
                </div>
                <div className="left">
                    <div>
                        {endDescription}
                    </div>
                    <DateTime
                        inputProps={{ placeholder: endDescription }}
                        value={end}
                        onChange={onEndChange}
                    />
                </div>
            </div>
        </div>
    );
}

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
 * Create a React Component that gets input from a select field with a prompt
 * @param {string} props.prompt   a description of the input the user is entering
 * @param {string} props.name     the name of the React Component
 * @param {string} props.value    the selection
 * @param {func}   props.onChange a function to handle changes to the input field
 * @param {node}   props.children the options the user has
 */
function SelectInput(props) {
    const {
        prompt,
        name,
        value,
        onChange,
        children,
    } = props;
    return (
        <div className="baseBorder">
            {prompt}
            {': '}
            <select name={name} value={value} onChange={onChange}>
                {children}
            </select>
        </div>
    );
}

// defines the object that checks the props passed into the SelectionInput
SelectInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

// defines the object that specified the default values for non-required props
SelectInput.defaultProps = {
    children: null,
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
    return (
        <SelectInput prompt="Notification Type" name={name} value={value} onChange={onChange}>
            <option value="">None</option>
            <option value={Notifications.noteEnum.EMAIL}>Email</option>
            <option value={Notifications.noteEnum.TEXT}>Text Message</option>
            <option value={Notifications.noteEnum.BANNER}>Banner</option>
            <option value={Notifications.noteEnum.PUSH}>Push</option>
        </SelectInput>
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
    return (
        <SelectInput prompt="Event Frequency" name={name} value={value} onChange={onChange}>
            <option value="">One Time</option>
            <option value={Frequency.freqEnum.DAILY}>Daily</option>
            <option value={Frequency.freqEnum.WEEKLY}>Weekly</option>
            <option value={Frequency.freqEnum.MONTHLY}>Monthly</option>
            <option value={Frequency.freqEnum.YEARLY}>Yearly</option>
            <option value={Frequency.freqEnum.CUSTOM}>Custom</option>
        </SelectInput>
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
};
