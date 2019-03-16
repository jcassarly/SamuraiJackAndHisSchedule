import React from 'react';
import DateTime from 'react-datetime';
import Frequency from "../events/Frequency"
import moment from 'moment'

import '../styles/StandardEventForm.css';
import '../styles/InputFields.css'

var NotificationEnum = {
    NONE: "None",
    EMAIL: "Email",
    TEXT: "Text Message",
    BANNER: "Banner Notification",
    PUSH: "Push Notification",
}

function BaseInput(props) {
    return (
        <div class="baseBorder">
            <label>
                {props.description}: <input
                    type={props.type}
                    name={props.name}
                    value={props.value}
                    checked={props.checked}
                    placeHolder={props.description}
                    onChange={props.onChange}
                /> {props.children}
            </label>
        </div>
    )
}

function TextInput(props) {
    return (
        <BaseInput
            type="text"
            name={props.name}
            value={props.value}
            description={props.description}
            onChange={props.onChange}
        >
            {props.children}
        </BaseInput>
    )
}

function NumberInput(props) {
    return (
        <BaseInput
            type="number"
            name={props.name}
            value={props.value}
            description={props.description}
            onChange={props.onChange}
        >
            {props.children}
        </BaseInput>
    )
}

function CheckboxInput(props) {
    return (
        <BaseInput
            type="checkbox"
            name={props.name}
            checked={props.checked}
            description={props.description}
            onChange={props.onChange}
        >
            {props.children}
        </BaseInput>
    )
}

function NameInput(props) {
    return (
        <TextInput name={props.name}
                   value={props.value}
                   description="Event Name"
                   onChange={props.onChange}
        />
    );
}

function DescriptionInput(props) {
    return (
        <TextInput name={props.name}
                   value={props.value}
                   description="Event Description"
                   onChange={props.onChange}
        />
    );
}

function StartEndInput(props) {
    return (
        <div class="baseBorder">
            <div class="center">
                <div class="left">
                    <label>
                        {props.startDescription}
                    </label>
                    <DateTime inputProps={{placeHolder: props.startDescription,}}
                            value={props.start}
                            onChange={props.onStartChange}
                    />
                </div>
                <div class="left">
                    <label>
                        {props.endDescription}
                    </label>
                    <DateTime inputProps={{placeHolder: props.endDescription,}}
                            value={props.end}
                            onChange={props.onEndChange}
                    />
                </div>
            </div>
        </div>
    );
}

function LocationInput(props) {
    return (
        <TextInput name={props.name}
                   value={props.value}
                   description="Event Location"
                   onChange={props.onChange}
        />
    );
}

function SelectInput(props) {
    return (
        <div class="baseBorder">
            <label>
                {props.prompt}: <select name={props.name} value={props.value} onChange={props.onChange}>
                    {props.children}
                </select>
            </label>
        </div>
    );
}

function NotificationSelect(props) {
    return (
        <SelectInput prompt="Notification Type" name={props.name} value={props.value} onChange={props.onChange}>
            <option value={NotificationEnum.NONE}>{NotificationEnum.NONE}</option>
            <option value={NotificationEnum.EMAIL}>{NotificationEnum.EMAIL}</option>
            <option value={NotificationEnum.TEXT}>{NotificationEnum.TEXT}</option>
            <option value={NotificationEnum.BANNER}>{NotificationEnum.BANNER}</option>
            <option value={NotificationEnum.PUSH}>{NotificationEnum.PUSH}</option>
        </SelectInput>
    );
}

function FrequencySelect(props) {
    return (
        <SelectInput prompt="Event Frequency" name={props.name} value={props.value} onChange={props.onChange}>
            <option value={null}>One Time</option>
            <option value={Frequency.freqEnum.DAILY}>Daily</option>
            <option value={Frequency.freqEnum.WEEKLY}>Weekly</option>
            <option value={Frequency.freqEnum.MONTHLY}>Monthly</option>
            <option value={Frequency.freqEnum.YEARLY}>Yearly</option>
            <option value={Frequency.freqEnum.CUSTOM}>Custom</option>
        </SelectInput>
    );
}

function NotificationTime(props) {
    return (
        <NumberInput
            name={props.name}
            value={props.value}
            description="Notification Time"
            onChange={props.onChange}
        />
    )
}

function LockEventInput(props) {
    return (
        <CheckboxInput
            name={props.name}
            checked={props.checked}
            description="Lock Event"
            onChange={props.onChange}
        />
    )
}

function UseLocationInput(props) {
    return (
        <CheckboxInput
            name={props.name}
            checked={props.checked}
            description="Use Location"
            onChange={props.onChange}
        />
    )
}

export {NameInput,
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
        FreqEnum,
        NotificationEnum};