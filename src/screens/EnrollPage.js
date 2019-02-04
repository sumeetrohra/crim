import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase';
import {
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
        result: null,
        name: '',
        date: '',
        crimeDetails: '',
        loading: false,
        disabled: false,
        persistedFaceId: null
    }

    //first thing to do is to search if there are any similiar faces
    componentWillMount = async () => {
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
                        this.setState({ result: res });
                        axios.post(`${enrollUrl}`, {
                            'url': res
                        }, {
                                headers
                            }
                        )
                            .then(result => {
                                this.setState({ result, persistedFaceId: result.data.persistedFaceId, loading: false });
                            })
                            .catch(err => this.setState({ result: err, loading: false }));
                    })
                    .catch(err => this.setState({ result: err, loading: false }));
            });
    }

    componentWillUnmount() {
        this.setState({ result: null });
    }

    onSavePress = () => {
        this.setState({ loading: true });
        firebase.database().ref('/faces').child(this.state.persistedFaceId).set({ 'name': this.state.name, 'date of birth': this.state.date, 'crime': this.state.crimeDetails })
            .then(() => this.setState({ loading: false, disabled: true, result: 'done' }))
            .catch(err => this.setState({ result: err, loading: false }));
    };

    renderButton() {
        if (this.state.loading) {
            return (
                <View>
                    <Spinner />
                </View>
            );
        }
        else if (!this.state.persistedFaceId && !this.state.loading) {
            return (
                <Container>
                    <Content>
                        <Text>Error: Cannot capture a face, Please try again</Text>
                        <Text>{JSON.stringify(this.state)}</Text>
                    </Content>
                </Container>
            );
        }
        return (
            <Button block bordered disabled={this.state.disabled} onPress={() => this.onSavePress()}>
                <Text>Save Details</Text>
            </Button>
        );
    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>New Entry</Title>
                    </Body>
                </Header>
                <Content padder>
                    <Form>
                        <Item>
                            <Label>Name</Label>
                            <Input onChangeText={name => this.setState({ name })} value={this.state.name} />
                        </Item>
                        <Item>
                            <Label>Date Of Birth</Label>
                            <DatePicker
                                defaultDate={this.state.date}
                                minimumDate={new Date(1930, 1, 1)}
                                maximumDate={new Date(2020, 1, 1)}
                                locale={'en'}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={'fade'}
                                androidMode={'default'}
                                placeHolderText="Select date"
                                textStyle={{ color: 'green' }}
                                placeHolderTextStyle={{ color: '#d3d3d3' }}
                                onDateChange={date => {
                                    this.setState({ date: date.toString().substr(4, 12) });
                                    console.log(this.state.date.toString());
                                }}
                                disabled={false}
                                value={this.state.date}
                            />
                        </Item>
                        <Item>
                            <Label>Enter Crime Details</Label>
                            <Textarea placeholder="" onChangeText={crimeDetails => this.setState({ crimeDetails })} value={this.state.crimeDetails} />
                        </Item>
                    </Form>
                    {this.renderButton()}
                    {/* <Text>{JSON.stringify(this.state)}</Text> */}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    const { uri, type } = state.cam;
    return { uri, type };
};

export default connect(mapStateToProps, null)(EnrollPage);
