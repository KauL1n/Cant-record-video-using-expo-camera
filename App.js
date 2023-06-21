import { useState, useRef, useEffect} from "react";
import { StyleSheet, Pressable, Text,View} from "react-native";
import { Video} from 'expo-av';
import * as MediaLibrary from 'expo-media-library'
import { Camera} from 'expo-camera'

/**
 * Create .apk
 * eas build -p android --profile preview
 */

//responsive fontSize scale

export default function App() {
    const cameraRef = useRef(null);

    const [muted, setMuted] = useState(false);

    const videoSequence = useRef(null);
    const [sequence,setSequence] = useState(null);

    const [hasPermission, setHasPermission] = useState(0);
    
    //Reqeust Camera Permission
    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            const soundStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasPermission(cameraStatus.granted === true && soundStatus.granted === true);
        })();
    }, [])

    if(hasPermission === false){
        return <Text>No access to camera</Text>
    }

    const takeVideo = async () => {
        if(cameraRef){
            try{
                const data = await cameraRef.current.recordAsync({maxDuration: 2});
                setSequence(data.uri)
            } catch(e){
                console.error(e);
            }
        }
    }

    _onPlaybackStatusUpdate = playbackStatus => {
        if (playbackStatus.didJustFinish){
            // The player has just finished playing and will stop.
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerCamera}>
                {!sequence ?
                <Camera
                    style={styles.camera}
                    type={Camera.Constants.Type.front}
                    flashMode={Camera.Constants.FlashMode.off}
                    ref={cameraRef}
                >
                </Camera>
                :
                <Pressable 
                    onPress={() => {
                        setMuted(true);
                        video.current.playFromPositionAsync(0);
                        videoSequence.current.playFromPositionAsync(0);
                    }}
                    style={styles.video}>
                    <Video
                        ref={videoSequence}
                        style={styles.sequence}
                        source={{uri: sequence}}
                        resizeMode="contain"
                />
                </Pressable>
                }
            </View>

            <View style={styles.containerStart}>
                <Pressable 
                    onPress={() => {
                        //toggle countdown
                        if(sequence)setSequence(null);
                        else takeVideo();
                    }}
                    style={styles.StartButtonBox}>
                    <Text style={styles.StartButtonStyle}>RECORD</Text>
                </Pressable>
                {
                    sequence?
                    <Pressable 
                        onPress={() => {
                            videoSequence.current.playFromPositionAsync(0);
                        }}
                        style={styles.StartButtonBox}>
                        <Text style={styles.StartButtonStyle}>PLAY</Text>
                    </Pressable>
                    : true
                }
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 0,
        paddingVertical: 5,
        justifyContent: "space-around",
        alignItems: "stretch"
    },
    //Video container
    //--------------------------------------
    containerVideo: {
        flex: 3,
    },
    video: {
        width: "100%",
        height: "100%",
    },
    //Camera container
    //--------------------------------------
    containerCamera: {
        flex: 7,
    },
    camera: {
        flex: 1,
        marginHorizontal: 30,
        /* TODO: old style edit when camera does not work 
        width: "75%",
        marginHorizontal: "12.5%", */
    },
    //Cameravideo container
    //--------------------------------------
    sequence: {
        flex: 1,
        marginHorizontal: 30,
        alignSelf: 'stretch',
        transform: [
            { scaleX: -1 }
        ]
    },
    //Start Button container
    //--------------------------------------
    containerStart: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row', 
    },
    StartButtonBox: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: "#38ACEC",
    },
    StartButtonStyle: {
        //Text of the Button
        fontSize: 20,
        color: "white"
    },
});
