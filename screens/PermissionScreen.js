import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity, Linking, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import firebase from '../firebaseConfig';
import { AntDesign, EvilIcons, MaterialCommunityIcons,MaterialIcons,Octicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import App from '../App';
import { SwipeButton } from 'react-native-expo-swipe-button';
import { LinearGradient } from 'expo-linear-gradient';
import Support from './Support';
import TimerScreen from './TimerScreen';
import * as Permissions from 'expo-permissions';


export default function PermissionScreen(props) {


      const [hasPermission, setHasPermission] = useState(null);
      const [hasLocationPermission, setHasLocationPermission] = useState(null);
      const [businessData,setBusinessData] =useState({})
      const [staffData,setStaffData] =useState({})
      const [businessUID, setBusinessUID] = useState("");
      const [peopleUID, setPeopleUID] = useState();
      const [scanned, setScanned] = useState(false);
      const [marked, setMarked] = useState(false);
      const [markingStarted, setMarkingStarted] = useState(false);
      const [showSwipe, setShowSwipe] = useState(false);
      const [showCameraLottie, setShowCameraLottie] = useState(false);
      const [showSwipeExit, setShowSwipeExit] = useState(false);
      const [showDistantLottie, setShowDistantLottie] = useState(false);
      const [showGPSLottie, setShowGPSLottie] = useState(false);
      const [tryAgain, setTryAgain] = useState(false);
      const animationRef = React.useRef();
      const [wrongQRCode, setWrongQRCode] = React.useState(false);
      const [currentLatitude, setCurrentLatitude] = React.useState(null);
      const [currentLongitude, setCurrentLongitude] = React.useState(null);
      const [errorMsg, setErrorMsg] = useState("");



      useEffect( () => {
        animationRef.current?.play()


      getCurrentLocation()
      }, [])

      const getCurrentLocation=async()=>{

        console.log("POSITION FECTHING STARTED ==> ")

        let location = await Location?.getCurrentPositionAsync({});
        console.log("POSITION CORDS ==> ", location?.coords)

        setCurrentLatitude(location?.coords?.latitude)
        setCurrentLongitude(location?.coords?.longitude)

      }

      useEffect(() => {

        checkCameraPermission();
        checkLocationPermission();

      }, []);

      const checkCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        console.log("status==> ", status )

        setHasPermission(status === 'granted');
      };

      const checkLocationPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        setHasLocationPermission(status === 'granted');
      };

      console.log("INSIDE PERMISION SCREEN==> ", currentLatitude, currentLongitude )
      console.log("setHasPermission==> ", hasLocationPermission, hasLocationPermission )



      const openSettings = () => {


        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
        
      };

      const dialCall = (number) => {
    
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel://${number}`; }
        else {phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
     };


     hasPermission && hasLocationPermission 
     ? props?.navigation?.navigate?.("StaffSetup")
     : null

    
      return (
        <View style={styles.container}>



          {hasPermission === false || hasPermission === null
                              ? <View style={{width:"100%",height:"100%",backgroundColor:"#FFF",paddingTop:50}}>
                                              
                              <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",margin:10,marginBottom:30}}>
                
                <Text style={{fontSize:29,fontFamily:"UberMoveBold",color:"#000",marginTop:10,paddingLeft:10}}>Camera Access</Text>
                <Text style={{fontSize:15,fontFamily:"UberMoveRegular",color:"#000",marginTop:20,paddingLeft:10}}>Inorder to scan the QR code, 1QR need access to your camera. Please enable it in phone settings.</Text>
                
                
                </View>
                
                <LottieView
                                                ref={animationRef}
                                                autoPlay
                                                loop={true}
                                                style={{flex:1,justifyContent:"center",alignItems:"center"}}
                                                source={require("../assets/camera.json")}
                                              />


<TouchableOpacity  onPress={()=> {checkCameraPermission() }}
                              style={{position:"absolute",borderRadius:18,bottom:80,backgroundColor:"#EEE",padding:15,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                              <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",}}>Try Again</Text>
                              </TouchableOpacity>
                                
                
                                            <TouchableOpacity 
                                      onPress={()=> {
                                        
                                        openSettings()
                                        
                                      
                                      } } 
                                      style={{position:"absolute",borderRadius:18,bottom:10,backgroundColor:"#000",padding:15 ,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                      <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#fff",}}>Open Phone Settings</Text>
                                      </TouchableOpacity>
                
                                
                
                                
                
                
                
                                  </View>
                              :null
                              }


          { hasLocationPermission === false || hasLocationPermission === null
                              ? <View style={{width:"100%",height:"100%",backgroundColor:"#FFF",paddingTop:50}}>
                                              
                              <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",margin:10,marginBottom:30}}>
                
                                  <Text style={{fontSize:29,fontFamily:"UberMoveBold",color:"#000",marginTop:10,paddingLeft:10}}>Location Access</Text>
                                  <Text style={{fontSize:15,fontFamily:"UberMoveRegular",color:"#000",marginTop:20,paddingLeft:10}}>We check for your location to be near the QR code. Hence, location serivce enabled is required.</Text>
                                  
                              
                              </View>
                              
                              <LottieView
                                                ref={animationRef}
                                                autoPlay
                                                loop={true}
                                                style={{flex:1,justifyContent:"center",alignItems:"center"}}
                                                source={require("../assets/redpin.json")}
                                              />
                                
                
                                <TouchableOpacity  onPress={()=> { checkLocationPermission()} }
                              style={{position:"absolute",borderRadius:18,bottom:80,backgroundColor:"#EEE",padding:15,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                              <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",}}>Try Again</Text>
                              </TouchableOpacity>
                                
                
                                            <TouchableOpacity 
                                      onPress={()=> {
                                        
                                        openSettings()
                                        
                                      
                                      } } 
                                      style={{position:"absolute",borderRadius:18,bottom:10,backgroundColor:"#000",padding:15 ,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                      <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#fff",}}>Open Phone Settings</Text>
                                      </TouchableOpacity>
                
                                
                
                
                
                                  </View>
                              :null
                              }

{ hasPermission && hasLocationPermission 
                              ? <View style={{width:"100%",height:"100%",backgroundColor:"#FFF",paddingTop:50}}>
                                              
                              <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",margin:10,marginBottom:30}}>
                
                                  <Text style={{fontSize:45,fontFamily:"UberMoveBold",color:"#000",marginTop:10,paddingLeft:10}}>Welcome</Text>
                                  <Text style={{fontSize:15,fontFamily:"UberMoveRegular",color:"#000",marginTop:0,paddingLeft:10}}>  You are all set.</Text>
                                  
                              
                              </View>
                              
                              <LottieView
                                                ref={animationRef}
                                                autoPlay
                                                loop={true}
                                                style={{flex:1,justifyContent:"center",alignItems:"center"}}
                                                source={require("../assets/scanning.json")}
                                              />
                                
                                            <TouchableOpacity  onPress={()=> {  

                                                props?.navigation?.navigate("StaffSetup")
                                            } } 
                                                style={{position:"absolute",borderRadius:18,bottom:10,backgroundColor:"#000",padding:15 ,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                                <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#fff",}}>Start Scanning</Text>
                                            </TouchableOpacity>
                
                                
                
                
                
                                  </View>
                              :null
                              }
            
          

        </View>
      );


    }

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});



