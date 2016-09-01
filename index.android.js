
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  TouchableHighlight,
  View,
  DatePickerIOS,
} from 'react-native'

import Camera from 'react-native-camera';


const react_native_camera = React.createClass({

    getInitialState() {
        return {
            recording: false,
            cameraType: Camera.constants.Type.front,
            captureTarget: Camera.constants.CaptureTarget.cameraRoll
        }
    },

    render() {
        const state = this.state;

        return (

            <Camera
                ref={(cam) => { this.camera = cam;}}
                style={styles.container}
                captureTarget={state.captureTarget}
                type={state.cameraType}>

                <View style={styles.buttonBar}>
                    { !state.recording ?

                        <View>
                            <TouchableHighlight style={styles.button} onPress={this.switchCamera}>
                                <Text style={styles.buttonText}>Flip</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.button} onPress={this.takePicture}>
                                <Text style={styles.buttonText}>Take picture</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.button} onPress={this.startVideo}>
                                <Text style={styles.buttonText}>Capture Video</Text>
                            </TouchableHighlight>
                        </View>

                        :

                        <TouchableHighlight style={styles.button} onPress={this.stopVideo}>
                            <Text style={styles.buttonText}>Stop video</Text>
                        </TouchableHighlight>
                    }
                </View>
            </Camera>
        );
    },

    takePicture() {
        if (this.camera) {
            this.camera.capture()
                .then((data) => console.log(data))
                .catch(err => console.error(err));
        }
    },

    switchCamera() {
        const cameraType = this.state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back;
        this.setState({
            cameraType
        });
    },

    startVideo() {
        if (this.camera) {
            this.camera.capture({mode: Camera.constants.CaptureMode.video})
                .then((data) => console.log(data))
                .catch(err => console.error(err));

            this.setState({
                recording: true
            });
        }
    },

    stopVideo() {
        if (this.camera) {
            this.camera.stopCapture();
            this.setState({
                recording: false
            });
        }
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    buttonBar: {
        flexDirection: "row",
        position: "absolute",
        bottom: 25,
        right: 0,
        left: 0,
        justifyContent: "center"
    },
    button: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#fff",
        margin: 5
    },
    buttonText: {
        color: '#fff'
    }
});


AppRegistry.registerComponent('react_native_camera', () => react_native_camera);
