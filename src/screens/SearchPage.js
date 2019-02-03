import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios'; import {
    Spinner,
    Container,
    Header,
    DatePicker,
    Content,
    Text,
    Body,
    Title,
    Form,
    Item,
    Label,
    Input,
    Textarea,
    Button
} from 'native-base';

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
        result: null,
        disabled: true,
        name: '',
        date: '',
        crimeDetails: '',
        persistedFaceId: null,
        loading: false
    }

    async componentWillMount() {
        this.setState({ loading: true });
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
                                        this.setState({ persistedFaceId: res1.data[0].persistedFaceId });
                                        firebase.database().ref('/faces').child(res1.data[0].persistedFaceId).once('value', (snapshot) => {
                                            this.setState({ date: snapshot.val()['date of birth'], name: snapshot.val().name, crimeDetails: snapshot.val().crime });
                                            this.setState({ loading: false });
                                        });
                                    })
                                    .catch(err => this.setState({ result: err, loading: false }));
                            })
                            .catch(err => this.setState({ result: err, loading: false }));
                    })
                    .catch(err => this.setState({ result: err, loading: false }));
            });
    }

    onEditPress = () => {
        this.setState({ loading: true });
        firebase.database().ref('/faces').child(this.state.persistedFaceId).set({ 'name': this.state.name, 'date of birth': this.state.date, 'crime': this.state.crimeDetails })
            .then(() => this.setState({ loading: false, disabled: true, result: 'done' }))
            .catch(err => this.setState({ result: err }));
    }

    render() {
        if (this.state.loading) {
            return <Spinner />;
        }
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Search/Edit</Title>
                    </Body>
                </Header>
                <Content padder>
                    <Form>
                        <Item>
                            <Label>Name</Label>
                            <Input onChangeText={name => this.setState({ name, disabled: false })} value={this.state.name} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Date Of Birth: {this.state.date}</Label>
                            <DatePicker
                                //defaultDate={this.state.result}
                                minimumDate={new Date(1930, 1, 1)}
                                maximumDate={new Date(2020, 1, 1)}
                                locale={'en'}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={'fade'}
                                androidMode={'default'}
                                //placeHolderText="Select date"
                                textStyle={{ color: 'green' }}
                                //placeHolderTextStyle={{ color: '#d3d3d3' }}
                                onDateChange={date => {
                                    this.setState({ date: date.toString().substr(4, 11), disabled: false });
                                    console.log(date.toString());
                                }}
                                disabled={false}
                            />
                        </Item>
                        <Item>
                            <Label>Enter Crime Details</Label>
                            <Textarea placeholder="" onChangeText={crimeDetails => this.setState({ crimeDetails, disabled: false })} value={this.state.crimeDetails} />
                        </Item>
                    </Form>
                    <Button disabled={this.state.disabled} onPress={() => this.onEditPress()}>
                        <Text>Save Changes</Text>
                    </Button>
                    <Text>{JSON.stringify(this.state)}</Text>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    const { uri, type } = state.cam;
    return { uri, type };
};

export default connect(mapStateToProps, null)(SearchPage);
