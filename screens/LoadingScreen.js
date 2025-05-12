
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";


export default function LoadingScreen(props) {
  const animationRef = React.useRef();

  useEffect(() => {
    animationRef.current?.play()
  }, [])

  return (<View style={{backgroundColor:"#FFF",height:"100%"}}>
          <View style={{width:"35%",height:"35%",flex:1,marginLeft:"31%"}}>
            <LottieView
                ref={animationRef}
                autoPlay
                loop={true}
              style={{flex:1,justifyContent:"center",alignItems:"center"}}
                source={require("../assets/qr.json")}
              />
          </View>
          </View>
    
  );
}