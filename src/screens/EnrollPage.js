import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase';
import {
    enrollUrl,
    headers
} from '../apiDetails/ApiDetails';

class EnrollPage extends Component {

    static navigationOptions = {
        header: null
    }

    state = {
        url: null,
        result: null
    }

    //first thing to do is to search if there are any similiar faces
    async componentWillMount() {
        const uri = this.props.uri;

        //this code gives me blob object, DO NOT TOUCH THIS CODE
        //start of no touch zone
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        //end of the no touch zone

        console.log(blob);
        firebase.storage().ref('temp/temp.jpg')
            .put(blob)
            .then(() => {
                firebase.storage().ref('temp/temp.jpg').getDownloadURL()
                    .then(res => {
                        axios.post(`${enrollUrl}`, {
                            'url': res
                        }, {
                                headers
                            }
                        )
                            .then(result => {
                                firebase.database().ref('/faces').child(result.data.persistedFaceId).set({ 'name': 'sumeet', 'data': 'temp data' })
                                    .then(res1 => this.setState({ result: res1 }))
                                    .catch(err => this.setState({ result: err }));
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            });
    }

    componentWillUnmount() {
        this.setState({ result: null });
    }

    render() {
        if (this.state.result) {
            return (
                <View>
                    <Text>{JSON.stringify(this.state)}</Text>
                </View>
            );
        }
        return (
            <View>
                <Text>Enroll page</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { uri, type } = state.cam;
    return { uri, type };
};

export default connect(mapStateToProps, null)(EnrollPage);
