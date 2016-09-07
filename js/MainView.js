import React, { Component } from 'react';
import Camera from 'react-native-camera';
import styles from './style';
import RNFB from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import apiKey from './api-key';
var base64 = require('base-64');

import {
  Dimensions,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

if (!apiKey) {
    console.error('You need a Microsoft Cognitive Service - Emotion API key');
}

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

        this.getVideoResult('https://api.projectoxford.ai/emotion/v1.0/operations/21a3b390-ae12-4a24-a719-11f31d333ed0');

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
                    <Camera ref={(cam) => { this.camera = cam;}}
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
        const view = this;

        if (view.camera) {

            // Register a callback for when the recording is finished 
            view.camera.capture({mode: Camera.constants.CaptureMode.video})
                .then((file) => {

                    // Get the file path and read it in base 64
                    const path = file.path.replace('file://', '');
                    let data = '';

                    RNFB.fs.readStream(path, 'base64')
                    .then((ifstream) => {
                        ifstream.open()
                        ifstream.onData((chunk) => {
                            data += chunk;
                        })
                        ifstream.onError((err) => {
                            console.log('Error reading stream', err);
                        })
                        ifstream.onEnd(() => {  
                            console.log('Finished reading stream');

                            // Upload the stream to the emotion API
                            RNFB.fetch('POST', 'https://api.projectoxford.ai/emotion/v1.0/recognizeinvideo', 
                                {
                                    'Ocp-Apim-Subscription-Key': apiKey,
                                    'Content-Type' : 'application/octet-stream',
                                }, 
                                data
                            )
                            .then((res) => {
                                // The Emotion API responds with an Operation-Location header
                                // That location should be further queried for emotion data
                                view.getVideoResult(res.respInfo.headers['Operation-Location']);
                            })
                            .catch((err) => {
                                console.error('Error', err);
                            });
                        });
                    });
            }); 

            view.setState({
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
    },

    getVideoResult(location) {
        console.log('Getting video result from location', location);

        setTimeout(() => {
            RNFB.fetch('GET', location, {'Ocp-Apim-Subscription-Key': apiKey})
            .then((res) => {
                const response = res.json();

                // Check if the processing is done
                if (response.status === 'Succeeded') {
                    const processedResult = JSON.parse(response.processingResult);
                    
                    // TODO: We should parse the result and store useful data
                    processedResult.fragments.forEach((el, index) => {
                        console.log(el);
                    });
                } 
                // Else if it's still processing (not failed) try to get the results again
                else if (response.status !== 'Failed') {
                    view.getVideoResult(location);
                }
            })
            .catch((err) => {
                console.error('Error', err);
            });
        }, 2000);
    }
});

export default MainView;