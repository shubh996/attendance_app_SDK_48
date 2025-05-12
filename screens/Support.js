import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import firebase from '../firebaseConfig';
import { AntDesign, EvilIcons, MaterialCommunityIcons,MaterialIcons,Octicons,Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import App from '../App';
import { SwipeButton } from 'react-native-expo-swipe-button';
import { LinearGradient } from 'expo-linear-gradient';


export default function Support(props) {

    const animationRef = React.useRef();


    useEffect( () => {
        animationRef.current?.play()
    
      }, [])
    

      const dialCall = (number) => {

        console.log("ISNIDE IE EI E E")
    
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel://${number}`; }
        else {phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
     };


  return (

<View style={{height:"100%",backgroundColor:"#FFF",}}>

<TouchableOpacity style={{backgroundColor:"#fff",flexDirection:"row",justifyContent:"flex-start",width:"100%",alignItems:"flex-start",padding:15,position:"absolute",top:45}} 
  onPress={()=> {props?.navigation?.goBack()}}>
                    
                    <View style={{flexDirection:"row",justifyContent:"space-evenly",marginLeft:0}}    >
                        <Ionicons name="md-chevron-back-outline" size={32} color="black" />
                    </View>
                    <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginRight:10,marginTop:-2}}>Settings</Text>

                </TouchableOpacity>
                                
                               


                                
                                <LottieView
                                                                ref={animationRef}
                                                                autoPlay
                                                                loop={true}
                                                                style={{justifyContent:"center",alignItems:"center",flex:1}}
                                                                source={require("../assets/support.json")}
                                                              />
                                                
                                
                                <TouchableOpacity 
                                                      onPress={()=> {
                                                        
                                                        dialCall("+916363751774")
                                                        
                                                      
                                                      } } 
                                                      style={{position:"absolute",bottom:90,backgroundColor:"#000",padding:20,borderRadius:360,paddingHorizontal:20,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                                      <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#FFF",}}>Contact Support</Text>
                                                      </TouchableOpacity>

                                <TouchableOpacity 
                                                      onPress={()=> {
                                                        
                                                        Alert.alert('Logout?', 'you can login again anytime', [
                                                            {
                                                              text: 'Confirm',
                                                              onPress: () => {
                                                                firebase.auth().signOut()
                                                            },
                                                            },{
                                                              text: "Cancel",
                                                              onPress: () => console.log("Cancel Pressed"),
                                                              style: "cancel"
                                                            },
                                                          ])
                                                        
                                                      
                                                      } } 
                                                      style={{position:"absolute",bottom:10,backgroundColor:"#EEE",padding:20,borderRadius:360,paddingHorizontal:20,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                                      <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",}}>Logout</Text>
                                                      </TouchableOpacity>
          

                          </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});


