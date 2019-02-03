import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import firebase from 'firebase';
import {
    createSwitchNavigator,
    createStackNavigator
} from 'react-navigation';
import { Container } from 'native-base';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import firebaseDetails from './apiDetails/ApiDetails';
import reducers from './reducers';
import Login from './screens/Login';
import Home from './screens/Home';
import CameraPage from './screens/CameraPage';
import EnrollPage from './screens/EnrollPage';
import SearchPage from './screens/SearchPage';


export default class App extends Component {

    componentWillMount() {
        firebase.initializeApp(firebaseDetails);
    }

    render() {
        console.disableYellowBox = true;
        return (
            <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
                <Container style={{ paddingTop: StatusBar.currentHeight }}>
                    <AppNavigator />
                </Container>
            </Provider>
        );
    }
}

const AppNavigator = createSwitchNavigator({
    Login,
    main: createStackNavigator({
        Home,
        CameraPage,
        EnrollPage,
        SearchPage
    })
},
    {
        initialRouteName: 'Login'
    }
);
