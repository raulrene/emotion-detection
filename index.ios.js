
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Camera from 'react-native-camera';

class react_native_camera extends Component {

    getInitialState: function() {
        return {
            cameraType: Camera.constants.Type.back
        }
    }

  render() {
    return (
      <View style={styles.container}>
            <Camera
                  ref={(cam) => {
                    this.camera = cam;
                  }}
                  type={this.state.cameraType}
                  style={styles.preview}
                  aspect={Camera.constants.Aspect.fill}>
                    <TouchableHighlight style={styles.button} onPress={this.switchCamera}>
                        <Text style={styles.buttonText}>Switch</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={this.takePicture}>
                        <Text style={styles.buttonText}>Capture</Text>
                    </TouchableHighlight>
            </Camera>
        </View>
    );
  }

    takePicture() {
      this.camera.capture()
        .then((data) => console.log(data))
        .catch(err => console.error(err));
    }

    switchCamera: function() {
        const state = this.state;
        state.cameraType = state.cameraType === Camera.constants.Type.back ? Camera.constants.Type.front : Camera.constants.Type.back;
        this.setState(state);
    }
}

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
        color: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#FFFFFF",
        margin: 5
    },
    buttonText: {
        color: "#FFFFFF"
    }
});


AppRegistry.registerComponent('react_native_camera', () => react_native_camera);
