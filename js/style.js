import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    cover: {...StyleSheet.absoluteFillObject, backgroundColor: "transparent"},

    camera: {
        height: 1,
        width: 1
    },

    container: {
        flex: 1,
        justifyContent: "flex-end",
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
        backgroundColor: "#209287",
        padding: 10,
        borderWidth: 1,
        borderColor: "#fff",
        margin: 5
    },
    
    buttonText: {
        textAlign: "center",
        color: '#fff'
    }
});

export default styles;