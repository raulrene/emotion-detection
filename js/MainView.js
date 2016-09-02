import React, { Component } from 'react';
import Camera from 'react-native-camera';
import styles from './style';

import {
  Dimensions,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

const MainView = React.createClass({
    camera: null,

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
            <View style={styles.container}>

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

                    <View>
                        <TouchableHighlight style={styles.button} onPress={this.stopVideo}>
                            <Text style={styles.buttonText}>Stop video</Text>
                        </TouchableHighlight>
                    </View>
                }


                <View>
                    <Camera
                        ref={(cam) => { this.camera = cam;}}
                        captureTarget={state.captureTarget}
                        style={styles.camera}
                        type={state.cameraType}>
                    </Camera>
                </View>
            </View>
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

export default MainView;