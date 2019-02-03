import {
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOADING,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED
} from '../actions/types';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: '',
    loading: false,
    user: null
};

export default (state = INITIAL_STATE, action) => {
    console.log(action);

    switch (action.type) {
        case EMAIL_CHANGED:
            return { ...state, email: action.payload };

        case PASSWORD_CHANGED:
            return { ...state, password: action.payload };

        case LOADING:
            return { ...state, loading: true, error: '' };

        case LOGIN_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: action.payload };

        case LOGIN_USER_FAILED:
            return { ...state, password: '', error: 'Please Try Again', loading: false };

        default:
            return state;
    }
};
