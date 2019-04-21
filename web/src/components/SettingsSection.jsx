import React from 'react';
import PropTypes from 'prop-types';

/**
 * Creates a section of settings for organization of related settings
 * @param {string} props.title    the title of the section
 * @param {node}   props.children the input fields for the settings in the section
 */
function SettingsSection(props) {
    const {
        title,
        children,
    } = props;

    // create a JSX object with the title above the children and appropriate CSS
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

// defines the object that checks the props passed into the SettingsSection
SettingsSection.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default SettingsSection;
