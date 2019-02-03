import {
    PHOTO_TAKEN,
    RECOGNITION_TYPE
} from '../actions/types';

const INITIAL_STATE = {
    uri: null,
    type: ''
};

export default (state = INITIAL_STATE, action) => {
    console.log(action);

    switch (action.type) {
        case PHOTO_TAKEN:
            return { ...state, uri: action.payload };

        case RECOGNITION_TYPE:
            return { ...state, type: action.payload };

        default:
            return state;
    }
};
