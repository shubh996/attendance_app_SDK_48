
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { View, Text } from 'react-native';


export default function NoInterentFound(props) {
  const animationRef = React.useRef();

  useEffect(() => {
    animationRef.current?.play()
  }, [])

  return (
<View style={{width:"100%",height:"100%",flex:1,}}>
<LottieView
    ref={animationRef}
    autoPlay
    loop={true}
  style={{flex:1,justifyContent:"center",alignItems:"center"}}
    source={require("../assets/nowifi.json")}
  />
<Text style={{textAlign:"center",color:"#000",fontSize:22,fontFamily:"UberMoveBold", position:"absolute",bottom:25,width:"100%"}}>Check Interent Connection</Text>
</View>
    
  );
}