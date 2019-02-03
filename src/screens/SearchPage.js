import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase';
import {
    detectFaceUrl,
    findSimiliarFacesUrl,
    headers
} from '../apiDetails/ApiDetails';

class SearchPage extends Component {

    static navigationOptions = {
        header: null
    }

    state = {
        result: null
    }

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
                        axios.post(`${detectFaceUrl}`, {
                            'url': res
                        }, {
                                headers
                            }
                        )//result.data[0].faceId
                            .then(result => {
                                axios.post(`${findSimiliarFacesUrl}`, {
                                    faceId: result.data[0].faceId,
                                    faceListId: 'test1',
                                    'maxNumOfCandidatesReturned': 1,
                                    'mode': 'matchPerson'
                                }, { headers })//res1.data[0].persistedFaceId
                                    .then(res1 => {
                                        firebase.database().ref('/faces').child(res1.data[0].persistedFaceId).once('value', (snapshot) => {
                                            this.setState({ result: snapshot.val() });
                                        });
                                    })
                                    .catch(err => this.setState({ result: err }));
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            });
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
                <Text>Search page</Text>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { uri, type } = state.cam;
    return { uri, type };
};

export default connect(mapStateToProps, null)(SearchPage);
