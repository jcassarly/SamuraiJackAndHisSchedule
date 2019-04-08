const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

function updateSettings(settings) {
    return {
        type: UPDATE_SETTINGS,
        payload: {
            settings,
        },
    };
}

export { updateSettings };
export { UPDATE_SETTINGS };
