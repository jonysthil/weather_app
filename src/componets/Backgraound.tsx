import React from 'react'
import { StatusBar, ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children: JSX.Element | JSX.Element[];
}

const Backgraound = ({ children }: Props) => {
    return (
        <View style={{ 
            flex: 1, 
            position: 'relative'
            //backgroundColor: '#212528'
            }}>
            <StatusBar
                animated= {true}
                barStyle = 'light-content'
                showHideTransition= 'fade'
            />
            {/**<LinearGradient 
                colors={['#191928', '#192645']} 
                start={{x: 0, y: 0}} 
                end={{x: 0, y: .5}}
                style={{ ...StyleSheet.absoluteFillObject }}
            />**/}
                <ImageBackground blurRadius={55} source={require('../assets/images/bg.jpg')} resizeMode="cover" style={styles.image} >
                { children }
                </ImageBackground>
        </View>
    )
}

export default Backgraound

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'center',
    }
});