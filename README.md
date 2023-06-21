# Cant-record-video-using-expo-camera
Minimal reproducible example

I'm designing an app in react-native using expo. Now I'm trying to record a short video sequence using expo-camera. On most devices(Android, any Galaxy S type) the function works without problems. But for example on a test device(Samsung Galaxy A71) the video preview works, but no video is recorded and the following error message appears:
~~~
Call to function 'ExponentCamera.record' has been rejected.
-> Caused by: java.lang.RuntimeException: Error retrieving camcorder profile params
~~~
I am in despair. On all Galaxy S devices, which I have tested, it works without problems. On the Samsung A71 I mentioned, only the preview appears and when I try to record a video, this message appears.

The code looks like:
~~~js
import { Camera} from 'expo-camera'

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
            const data = await cameraRef.current.recordAsync();
            setSequence(data.uri)
        } catch(e){
            console.error(e);
        }
    }
}
...
<Camera
                style={styles.camera}
                type={Camera.Constants.Type.front}
                flashMode={Camera.Constants.FlashMode.off}
                ref={cameraRef}
            >
</Camera>
<Pressable 
    onPress={() => {
        takeVideo();
    }}
    style={styles.video}>
</Pressable>
~~~
I hope someone can help me. Thanks for your time :)
