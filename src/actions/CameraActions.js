import {
    PHOTO_TAKEN,
    RECOGNITION_TYPE
} from './types';

export const photoUri = (uri) => {
    return {
        type: PHOTO_TAKEN,
        payload: uri
    };
};

export const recognitionType = (text) => {
    return {
        type: RECOGNITION_TYPE,
        payload: text
    };
};
