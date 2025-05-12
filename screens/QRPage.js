import React,{useEffect,useRef, useState} from 'react'
import {Card, Text, View, TextField, ActivityIndicator} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { FontAwesome5, FontAwesome ,Ionicons} from '@expo/vector-icons';
import { AntDesign, EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';
import { Fontisto } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import axios from 'axios';

import * as DocumentPicker from 'expo-document-picker';

import RBSheet from "react-native-raw-bottom-sheet";
import { WebView } from 'react-native-webview';
import LottieView from 'lottie-react-native';
import * as Linking from 'expo-linking';
import QRCode from 'react-native-qrcode-svg';
import {captureRef} from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as StoreReview from 'expo-store-review';
import { BarCodeScanner } from 'expo-barcode-scanner';




export default function QRPage(props,navigation) {
  
  const [userData, setUserData] = React.useState({});
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [scanned, setScanned] = React.useState(false);
  const [hasCameraPermission, setCameraPermission] = useState(null);
  const animationRef = React.useRef();




  useEffect(() => {
    
      console.log(props?.route?.params?.uid)
      firebase.firestore().collection('users').doc(props?.route?.params?.uid).onSnapshot(doc => {setUserData(doc?.data())})

  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setCameraPermission(status === 'granted');
    })();
  }, []);




    const handleBarCodeScanned = ({ type, data }) => {

      console.log("SCANNNED DATA ==> ", data)

      setScanned(true);
      setData(data)
      
      
    };


    const updateQRCode = () => {
      setLoading(true)
      firebase.firestore().collection("att_users").doc(userData?.uid).update({"qrCodeData" : data}).then(()=>{
         setLoading(false)
         props?.navigation?.goBack()
        })
    }


    const openSettings = () => {


      if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:');
      } else {
        Linking.openSettings();
      }
      
    };

    
  return (

    <View style={{backgroundColor:"#FFF",flex:1}}>

               


                

              {scanned 
              ? <View style={{marginTop:0 ,height:"100%",backgroundColor:"#fff"   }}>

    
                <TouchableOpacity onPress={()=> props?.navigation?.goBack()} style={{width:"100%",paddingTop:"15%",paddingLeft:20}}    >
                <Ionicons name="ios-arrow-back-outline" size={44} color="black" />                      
                </TouchableOpacity>
                
                

                      

                  <View  style={{padding:20,width:"80%",marginLeft:"10%",marginTop:"8%",borderRadius:18, backgroundColor:"#000",marginBottom:15,paddingTop:30,
                                                  shadowOffset:{width:8,height:6.6},shadowColor:userData?.card?.[0]["cardBackgroundColor"][0]["id"],shadowOpacity:0.41,elevation: 15,
                                                  }}>
                            <Text  style={{fontFamily:"UberMoveMedium",fontSize:22, marginBottom:25,textAlign:"center",color:"#FFF"}}>Scanned QR Code</Text>
                            <QRCode quietZone={5} size={Dimensions.get('window').width/1.44} value={data}/>
          
                  </View>

                 

                  <TouchableOpacity onPress={()=> updateQRCode() }  style={{position:"absolute",bottom:10,padding:12.5,width:"90%",margin:"5%",borderRadius:18,backgroundColor:"#000",}}>
                        {loading 
                          ?<ActivityIndicator  color={"#FFF"} size={"small"} />
                          :<View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:10}}>
                           <Text style={{fontSize:17,fontFamily:"UberMoveMedium",color:"#FFF",width:"80%"}}>Want to register this scanned QR as your Attendance QR code ?</Text>
                              
                            <Octicons name="check" size={40} color="white" />
                          </View>
                          }
                        </TouchableOpacity>

                  

              </View> 
              :hasCameraPermission === false || hasCameraPermission === null
                ?<View style={{width:"100%",height:"100%",backgroundColor:"#FFF",paddingTop:50}}>
                              
              <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",margin:10,marginBottom:30}}>

<Text style={{fontSize:29,fontFamily:"UberMoveBold",color:"#000",marginTop:10,paddingLeft:10}}>Camera Access</Text>
<Text style={{fontSize:15,fontFamily:"UberMoveMedium",color:"#000",marginTop:20,paddingLeft:10}}>Inorder to scan the QR code, 1QR App need access to your camera. Please enable it in phone settings.</Text>


</View>

<LottieView
                                ref={animationRef}
                                autoPlay
                                loop={true}
                                style={{flex:1,justifyContent:"center",alignItems:"center"}}
                                source={require("../assets/camera.json")}
                              />
                

                            <TouchableOpacity 
                                onPress={()=> {
                                  
                                  openSettings()
                                  
                                
                                } } 
                                style={{position:"absolute",borderRadius:18,bottom:10,backgroundColor:"#000",padding:15,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                                <Text style={{fontSize:25,fontFamily:"UberMoveMedium",color:"#FFF",}}>{
                                    "Open Phone Settings"}</Text>
                                <Octicons name="chevron-right" size={26} color="#FFF" style={{margin:5}} />
                                </TouchableOpacity>

                

                



                  </View> 
                :<>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={[StyleSheet.absoluteFillObject,{backgroundColor:"#000",height:"100%"}]}
              />

                  <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:25,marginTop:Platform.OS === "ios" ? 65 : 50    }}>

                      <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"flex-start",marginLeft:10}}  
                      onPress={()=> props?.navigation?.goBack()}  >
                              <Ionicons name="md-chevron-back-outline" size={35} color="#FFF" />
                              <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#FFF",marginLeft:-5}}>Scan QR Code</Text>
                      </TouchableOpacity>

                  </View>
              </>
              }


                        



      


                {/* {userData?.name 
                ?<View style={{borderColor:"#000",paddingTop:100,paddingBottom:50,paddingHorizontal:0,flexDirection:"column",justifyContent:"center",alignContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#FFF",marginBottom:300 }}>
                
                

                <QRCode
                logoSize={75}
                logo={require("../assets/1qrlogomargin.png")} 
                logoBorderRadius={9} 
                logoMargin={8} 
                quietZone={5} 
                size={(Dimensions.get('window').width)-20} 
                width={"100%"} height={"100%"} 
                value={`https://1qr.co.in/attendance${userData?.generating_uid}`}
                />

                <Text style={{fontSize:18,paddingTop:10,fontFamily:"UberMoveRegular",textAlign:"center",paddingBottom:15,backgroundColor:"#fff",color:"#000"}}>powered by 1QR.co.in</Text>

                </View>
                :null

                }


<View ref={down} style={{marginTop:300,paddingTop:50,paddingBottom:50,paddingHorizontal:20,flexDirection:"column",justifyContent:"center",alignContent:"center",alignSelf:"center",alignItems:"center",backgroundColor:"#FFF",marginBottom:100 }}>
                
<View  style={{padding:5,borderRadius:100,borderColor:"#000",borderWidth:5,backgroundColor:"#000",paddingHorizontal:20,paddingVertical:5,marginBottom:50}}><Text style={{fontSize:20,fontFamily:"UberMoveBold",textAlign:"center",color:"#fff"}}>{userData?.name}</Text></View>


                <QRCode
                logoSize={75}
                logo={require("../assets/1qrlogomargin.png")} 
                logoBorderRadius={9} 
                logoMargin={8}
                quietZone={5} size={(Dimensions.get('window').width)-40} width={"100%"} height={"100%"} value={`https://1qr.co.in/attendance${userData?.generating_uid}`}/>
                <Text style={{fontSize:18,paddingTop:10,fontFamily:"UberMoveRegular",textAlign:"center",paddingBottom:15,backgroundColor:"#fff",color:"#000"}}>powered by 1QR.co.in</Text>

                </View> */}


                
       
                

      </View>


            
   
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1, 
    },
    actStyle:{

      
        backgroundColor: "#000",
        padding:5,
        borderColor:"#000",
        borderRadius: 6,
        marginTop: 10,
        color:"#FFF",
        width:"100%"

    },
    inactStyle:{

      
        backgroundColor: "#EEE",
        padding:5,
        borderColor:"#000",
        borderRadius: 6,
        marginTop: 10,
        color:"#000",
        width:"100%"

    },
    image: {
      resizeMode: 'center',
      
  },

})

