import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DateTime from 'react-datetime';
import Frequency from '../events/Frequency';
import Notifications from '../events/Notifications';

import '../styles/StandardEventForm.css';
import '../styles/InputFields.css';

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

BaseInput.defaultProps = {
    value: undefined,
    checked: false,
    children: null,
};

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

TextInput.propTypes = {
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

TextInput.defaultProps = {
    children: null,
};

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

NumberInput.propTypes = {
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

NumberInput.defaultProps = {
    children: null,
};

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

CheckboxInput.propTypes = {
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

CheckboxInput.defaultProps = {
    children: null,
};

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

NameInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

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

DescriptionInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

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

StartEndInput.propTypes = {
    startDescription: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(moment).isRequired,
    onStartChange: PropTypes.func.isRequired,

    endDescription: PropTypes.string.isRequired,
    end: PropTypes.instanceOf(moment).isRequired,
    onEndChange: PropTypes.func.isRequired,
};

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

LocationInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};


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

SelectInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

SelectInput.defaultProps = {
    children: null,
};

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

NotificationSelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

NotificationSelect.defaultProps = {
    value: '',
};

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

FrequencySelect.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

FrequencySelect.defaultProps = {
    value: '',
};

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

NotificationTime.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

function LockEventInput(props) {
    const {
        name,
        checked,
        onChange,
    } = props;
    return (
        <CheckboxInput
            name={name}
            checked={checked}
            description="Lock Event"
            onChange={onChange}
        />
    );
}

LockEventInput.propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

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
