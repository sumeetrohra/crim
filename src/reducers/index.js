import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import CameraReducer from './CameraReducer';

export default combineReducers({
    auth: AuthReducer,
    cam: CameraReducer
});
