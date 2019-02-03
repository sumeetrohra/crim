import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import {
    Container,
    Header,
    Content,
    Form,
    Item,
    Input,
    Label,
    Body,
    Title,
    Button,
    Text,
    Spinner
} from 'native-base';
import { Font } from 'expo';
import { connect } from 'react-redux';

import {
    emailChanged,
    passwordChanged,
    loginUser
} from '../actions';

class Login extends Component {

    state = {
        loading: true
    }

    async componentWillMount() {
        await Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
        });

        this.setState({ loading: false });

        const token = await AsyncStorage.getItem('token');
        if (token) {
            this.props.navigation.navigate('Home');
        }
    }

    componentDidUpdate() {
        if (this.props.user) {
            this.onAuthCOmplete();
        }
    }

    onAuthCOmplete = async () => {
        try {
            await AsyncStorage.setItem('token', JSON.stringify(this.props.user));
            this.props.navigation.navigate('Home');
        }
        catch (err) {
            console.log(err);
        }
    }

    renderButton() {
        if (this.props.loading) {
            return <Spinner />;
        }
        return (
            <Button
                full style={{ marginTop: 15 }}
                onPress={() => {
                    const { email, password } = this.props;
                    this.props.loginUser({ email, password });
                }}
            >
                <Text>Submit</Text>
            </Button>
        );
    }

    renderError() {
        if (this.props.error) {
            return <Text>{this.props.error}</Text>;
        }
    }

    render() {
        if (this.state.loading) {
            return <Spinner />;
        }

        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Login</Title>
                    </Body>
                </Header>
                <Content style={{ padding: 5, paddingRight: 5 }}>
                    <Form>
                        <Item stackedLabel>
                            <Label>ID</Label>
                            <Input onChangeText={text => this.props.emailChanged(text)} value={this.props.email} />
                        </Item>
                        <Item stackedLabel>
                            <Label>Password</Label>
                            <Input onChangeText={text => this.props.passwordChanged(text)} value={this.props.password} secureTextEntry />
                        </Item>
                    </Form>
                    {this.renderError()}
                    {this.renderButton()}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    const { email, password, loading, error, user } = state.auth;
    return { email, password, loading, error, user };
};

export default connect(mapStateToProps, {
    emailChanged,
    passwordChanged,
    loginUser
})(Login);
