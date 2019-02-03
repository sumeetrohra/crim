import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';
import { connect } from 'react-redux';

import {
    photoUri
} from '../actions';

class CameraPage extends Component {

    static navigationOptions = {
        header: null
    }

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.front,
        photo: null
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
        console.log(FileSystem.documentDirectory);
        try {
            await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}photos`);
        }
        catch (err) {
            console.log(err);
        }
    }

    async takePicture() {
        console.log('Button Pressed');
        if (this.camera) {
            const options = {
                quality: 1,
                base64: false,
                fixOrientation: true,
                exif: true
            };
            const photo = await this.camera.takePictureAsync(options);
            this.props.photoUri(photo.uri);
            if (this.props.type === 'new') {
                this.props.navigation.navigate('EnrollPage');
            }
            else if (this.props.type === 'search') {
                this.props.navigation.navigate('SearchPage');
            }
        }
    }

    render() {
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        }
        else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        }
        return (
            <View style={{ flex: 1 }}>
                <Camera
                    style={{ flex: 1 }}
                    type={this.state.type}
                    quality={'1'}
                    ratio={'2:3'}
                    autofocus={Camera.Constants.AutoFocus.on}
                    ref={(ref) => { this.camera = ref; }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                                backgroundColor: 'white'
                            }}
                            onPress={this.takePicture.bind(this)}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    marginBottom: 10,
                                    color: 'black'
                                }}
                            >
                                {' '}Take Picture{' '}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        );
    }

}

const mapStateToProps = state => {
    const { uri, type } = state.cam;
    return { uri, type };
};

export default connect(mapStateToProps, {
    photoUri
})(CameraPage);
