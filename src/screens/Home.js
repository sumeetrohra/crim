import React, { Component } from 'react';
import {
    Container,
    Header,
    Content,
    Button,
    Text,
    Body,
    Title
} from 'native-base';
import { connect } from 'react-redux';
import axios from 'axios';

import {
    recognitionType
} from '../actions';

class Home extends Component {

    static navigationOptions = {
        header: null
    }

    state = {
        result: null
    }

    componentWillMount() {
        console.log('in home page');
        axios.get('https://centralindia.api.cognitive.microsoft.com/face/v1.0/facelists/test1',
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': '1bed49da018846269ea71a7c4bf91f2d'
                }
            }
        )
            .then(res => this.setState({ result: res.data }))
            .catch(err => this.setState({ result: err }));
    }

    componentWillUnmount() {
        this.setState({ result: null });
    }

    onButtonPress = (text) => {
        this.props.recognitionType(text);
        this.props.navigation.navigate('CameraPage');
    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Home</Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={styles.contentStyle}>
                    <Button block bordered onPress={() => this.onButtonPress('new')}>
                        <Text>New</Text>
                    </Button>
                    <Button block bordered style={styles.buttonStyle} onPress={() => this.onButtonPress('search')}>
                        <Text>Search</Text>
                    </Button>
                    <Text>{JSON.stringify(this.state)}</Text>
                </Content>
            </Container>
        );
    }
}

const styles = {
    contentStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    buttonStyle: {
        marginTop: 10
    }
};

export default connect(null, { recognitionType })(Home);
