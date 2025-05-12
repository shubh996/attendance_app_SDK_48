import { WebView } from 'react-native-webview';
import React,{useEffect,useRef} from 'react'
import {Card, Text, View,Switch, Badge} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image,Dimensions ,StyleSheet,PixelRatio,Platform,KeyboardAvoidingView,TouchableWithoutFeedback,Button,ScrollView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5,Ionicons , MaterialCommunityIcons} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';
import { Fontisto,Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import OTPTextView from 'react-native-otp-textinput';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Share } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import {captureRef} from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { BarCodeScanner } from 'expo-barcode-scanner';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });



export default function AccountSetup(props) {




  var hours = new Date().getHours();
  const [greeting, setGreeting] = React.useState( hours > 4 && hours <12 ?"Good Morning" : hours > 12 && hours <16 ? "Good Afternoon" : hours > 16 && hours <22 ?"Good Evening" : hours > 16 && hours <23 ?"Good Night" : hours > 0 && hours <4 ?"Good Night" :"Welcome"  );
  const [name, setName] = React.useState("");
  const [stage, setStage] = React.useState("qr");
  const [userData, setUserData] = React.useState({});
  const [longitude, setLongitude] = React.useState(null);
  const [latitude, setLatitude] = React.useState(null);
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [showTestNoti, setShowTestNoti] = React.useState(false);
  const [notification, setNotification] = React.useState(false);
  const [freeAccount, setFreeAccount] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [scanned, setScanned] = React.useState(false);


  const notificationListener = useRef();
  const responseListener = useRef();



    useEffect(() => {
    firebase.firestore().collection('att_users').doc(props?.route?.params?.uid).onSnapshot(doc => {   setUserData(doc.data()), setName(doc?.data()?.name) })
    firebase.firestore().collection('att_users').doc("k8kPP10kj6aDg1ChQnETzH1oArf1").onSnapshot(doc => { setFreeAccount(doc?.data()?.free_account_creation)})

}, []);


const updateName = () => {

  console.log("NAME ==>",name)

    if(name && latitude && longitude) {
      setLoading(true)
      firebase.firestore().collection("att_users").doc(userData?.uid).update({"longitude": longitude, "latitude": latitude,"name" : name,stage:"sub"}).then(()=>{setStage("sub"), setLoading(false)})
    }
    else return alert("Please seach your business")


      

  }

  const updateNoti = () => {
    setLoading(true)
    firebase.firestore().collection("att_users").doc(userData?.uid).update({"notificationEnable" : showTestNoti,stage:"sub"}).then(()=>{setStage("sub"), setLoading(false)})
  }

  const startFreeTrial = ()=>{
    setLoading(true)
    firebase.firestore().collection("att_users").doc(userData?.uid).update({"freeTrial" : true,freeTrialStartDate : Date.now(), stage:"freeTrial"}).then(()=>{setLoading(false) , props?.navigation.navigate("HomeScreen")})
  }

  useEffect(() => {

    if(stage == "noti"){

    registerForPushNotificationsAsync().then(token => {firebase.firestore().collection('att_users').doc(props?.route?.params?.uid).update({"expoToken" : token })
                                                        setExpoPushToken(token)
                                                    })

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
     alert(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };

  }

  }, [stage]);

  const dialCall = (number) => {
    
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel://${number}`; }
    else {phoneNumber = `telprompt:${number}`; }
    Linking.openURL(phoneNumber);
 };



  const schedulePushNotification=async()=> {
    showTestNoti ? null : registerForPushNotificationsAsync()
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Hello! ${name}`,
        body: 'This is a test notification from 1QR',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 1 },
    });
    
  }


  const registerForPushNotificationsAsync = async() => {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    console.log("Device.isDevice)",Device)

  
    if (Device.isDevice) {

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted' || finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {

        setShowTestNoti(false)

        Alert.alert('Allow Notification', 'please switch notifications on from settings', [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },{
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
          ]);
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setShowTestNoti(true)
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  const handleBarCodeScanned = ({ type, data }) => {

    console.log("SCANNNED DATA ==> ", data)

    if(data?.split("action")[1] === staffData?.business_uid ){

        setTryAgain(false)
        setScanned(true);
        setBusinessUID(data?.split("action")[1])

        firebase.firestore().collection("att_users").doc(data?.split("action")[1]).onSnapshot(doc=>{
          setBusinessData(doc?.data())
          staffData?.active_session_id ? setShowSwipeExit(true) : setShowSwipe(true)
        })

    }

    else{
      setScanned(true)
      setTryAgain(true)
    }

    

  };



  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.inner}>
      {stage== "qr" 
              
              ?<><ScrollView>
            <Text style={{fontSize:28,fontFamily:"UberMoveBold",color:"#000",paddingTop:60,padding:20}}>{greeting}</Text>
            <View  style={{padding:20,width:"90%",marginLeft:"5%",marginTop:"18%",borderRadius:18, backgroundColor:"#000",marginBottom:15,paddingTop:30,
                                                  shadowOffset:{width:8,height:6.6},shadowColor:userData?.card?.[0]["cardBackgroundColor"][0]["id"],shadowOpacity:0.41,elevation: 15,
                                                  }}>

<Text  style={{fontFamily:"UberMoveMedium",fontSize:22, marginBottom:25,textAlign:"center",color:"#FFF"}}>Your Attendance QR Code</Text>

                     
                      <QRCode quietZone={5} size={Dimensions.get('window').width/1.28} value={`https://1qr.co.in/action${userData?.generating_uid}`}/>

                          

            </View>
            </ScrollView>
            <TouchableOpacity onPress={()=>{ setStage( props?.route?.params?.stage == "done" ? "sub" :"name")} }  style={{position:"absolute",bottom:25,padding:12.5,width:"90%",margin:"5%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}><Feather name="arrow-right" size={40} color="white" /></TouchableOpacity>

            </>

              :null

            }

{stage== "name" 
            
            ?<>
                    
                    
                    { Platform.OS == "ios" &&  latitude && longitude

                    ?null
                    :<>
                    
                      <Text style={{fontSize:28,fontFamily:"UberMoveBold",color:"#000",paddingTop:70,padding:20}}>Location where your will keep the QR Code</Text>
                      <Text style={{fontSize:14,fontFamily:"UberMoveLight",color:"#000",paddingHorizontal:25,marginTop:-10}}>powered by Google Search</Text>
                    
                    
                    
                    <GooglePlacesAutocomplete
                          autoFocus

                          placeholder='Search Location'
                          fetchDetails={true}
                          value={name}
                          onPress={(data, details = null) => {
                            console.log("DETAILS===> ", details?.geometry?.location);
                            setLatitude(details?.geometry?.location?.lat)
                            setLongitude(details?.geometry?.location?.lng)
                            setName( data.description)

                          }}
                          listViewDisplayed={false}
                          enablePoweredByContainer={false}
                          query={{
                            key: 'AIzaSyDtVpAhDQW3so0JBOAhdsWlt6EFWT93RNM',
                            language: 'en',
                          }}
                          onFail={error => console.error(error)}
                          styles={{
                            textInputContainer: {
                              backgroundColor: '#EEE',
                              margin:20,
                              marginVertical:30,
                             
                            },
                            textInput: {
                              height: 60,
                              color: '#000',
                              fontSize: 17,
                              backgroundColor: '#EEE',
                            },
                          }}
                          />

</>
                    }
                      

            
                    

                      { latitude && longitude
                        
                        ?<>
                        
                        <TouchableOpacity onPress={()=> updateName() }  style={{position:"absolute",bottom:0,padding:12.5,width:"90%",margin:"5%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                        {loading ?<ActivityIndicator  color={"#FFF"} size={"small"} />:<FontAwesome5 name="check" size={30} color="white" />}
                        </TouchableOpacity>

                        { Platform.OS == "ios" ?<TouchableOpacity onPress={()=> setLatitude(null) }  style={{position:"absolute",top:40,right:0,paddingHorizontal:10,paddingVertical:7,borderWidth:1,borderColor:"#000",margin:"5%",borderRadius:360,backgroundColor:"#FFF",flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                        <Text  style={{fontFamily:"UberMoveBold",fontSize:20,textAlign:"center",color:"#000"}}>Change location ?</Text>
                        </TouchableOpacity> : null}

                        </>

                        :null

                        }
                        </>

            :null

          }

{stage== "noti" 
            
            ?<>
          

            <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={[StyleSheet.absoluteFillObject,{backgroundColor:"#000",height:"110%"}]}
          />

            <View style={{backgroundColor:"#000",position:"absolute",bottom:0}}>

                <Text style={{fontSize:38,fontFamily:"UberMoveBold",color:"#FFF",paddingTop:60,padding:20,}}>Scan QR Code</Text>
                <Text style={{fontSize:18,fontFamily:"UberMoveRegular",color:"#FFF",paddingTop:60,padding:20}}>Register your payment QR code for attendance</Text>

            </View>
           
            </>

            :null

          }
          
          {stage== "sub" || stage =="demo"
            
            ?<><ScrollView>
            <Text style={{fontSize:38,fontFamily:"UberMoveBold",color:"#000",paddingTop:60,padding:20}}>Subscription</Text>
            {/* <View style={{borderColor:"#555",height:1,borderWidth:0.4,margin:20,marginTop:-12}}></View> */}
            <Text style={{color:"#555",fontSize:15,fontFamily:"UberMoveRegular",margin:20,textAlign:"justify",marginTop:-15}}>1QR Attendance App is a paid service. </Text>


      
      <TouchableOpacity  onPress={async () => await schedulePushNotification()}  style={{
        shadowRadius:12,shadowOffset:{width:8,height:6.6},shadowColor: Platform.OS == "ios" ? "#A9A9A9" : "#FFF",shadowOpacity:0.81,elevation: 70,
        marginTop:30,padding:25.5,width:"90%",margin:"5%",borderRadius:16,borderWidth:0,backgroundColor:"#000"}}>
      <View style={{flexDirection:"row",alignItems:"baseline"}}>
      <Text style={{color:"#FFF",fontSize:20,fontFamily:"UberMoveRegular"}}>₹</Text>
<Text style={{color:"#FFF",fontSize:65,fontFamily:"UberMoveLight",marginLeft:5}}>99</Text>
</View>
<View style={{backgroundColor:"#EEE",padding:5,borderRadius:180,width:"40%",marginVertical:10}}><Text style={{color:"#000",fontSize:15,fontFamily:"UberMoveRegular",textAlign:"center"}}>/user /month</Text></View>

          

          <TouchableOpacity 
          onPress={()=>dialCall("+916363751774")} 
          // onPress={ ()=> props?.navigation.navigate("PaymentScreen",{"subType":"monthly"})}  
          style={{padding:12.5,width:"100%",borderRadius:18,backgroundColor:"#007aff",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center",marginTop:20,marginBottom:-5}}>
            <Text style={{color:"#FFF",fontSize:18,fontFamily:"UberMoveRegular"}}>Contact Sales Team</Text>
            </TouchableOpacity>

          
        </TouchableOpacity>
        

        {/* <TouchableOpacity  onPress={async () => await schedulePushNotification()}  style={{marginTop:10,padding:15.5,width:"90%",margin:"5%",borderRadius:18,borderWidth:0.5,backgroundColor:"#fff"}}>
      <View style={{flexDirection:"row",alignItems:"baseline"}}>
      <Text style={{color:"#000",fontSize:20,fontFamily:"UberMoveRegular"}}>₹</Text>
<Text style={{color:"#000",fontSize:45,fontFamily:"UberMoveRegular",marginLeft:5}}>999</Text>
</View>
<View style={{backgroundColor:"#EEE",padding:5,borderRadius:180,width:"32%",marginVertical:10}}><Text style={{color:"#000",fontSize:15,fontFamily:"UberMoveRegular",textAlign:"center"}}>per year</Text></View>

          

          <TouchableOpacity onPress={ ()=> props?.navigation.navigate("PaymentScreen",{"subType":"yearly"})}  style={{padding:12.5,width:"100%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center",marginTop:10,marginBottom:-5}}><Text style={{color:"#FFF",fontSize:20,fontFamily:"UberMoveRegular"}}>Purchase</Text></TouchableOpacity>

          
        </TouchableOpacity> */}


            </ScrollView>

            {freeAccount
            
            ?<TouchableOpacity 
            
            onPress={ ()=> {Alert.alert('1 Month Free Trial', 'You will be navigated to Control Center, a dashboard where you can customize your 1QR code features.', [
            
            {
              text: 'Start',
              onPress: () => startFreeTrial(),
            },
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
           
          ]);} }  
            style={{borderColor:"#000",borderWidth:0.6,position:"absolute",bottom:90,padding:12.5,width:"90%",margin:"5%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
            
              {loading 
                ?<ActivityIndicator color={"#000"} color={"#FFF"} size={"small"} />
                :<Text style={{color:"#FFF",fontSize:20,fontFamily:"UberMoveMedium"}}>Activate Free 1 Month Trial</Text>
              }
            
            </TouchableOpacity>
            
            :null}

            <View style={{position:"absolute",bottom:30,flexDirection:"row",justifyContent:"space-between",width:"90%",left:"6%",alignItems:"center"}}>


            <TouchableOpacity  onPress={()=>{
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
                      }}
                      
                      
                     
          style={{width:"47.5%",borderColor:"#000",borderWidth:0,padding:12.5,borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:"#fff",fontSize:20,fontFamily:"UberMoveMedium"}}>Logout</Text></TouchableOpacity>

            
            
            <TouchableOpacity onPress={()=>{
              setLoading(true)
                firebase.firestore().collection("att_users").doc(userData?.uid).update({"demoRequested" : true,stage:"demo"}).then(()=>{setStage("book"),setLoading(false)})
            
            }}  
                style={{width:"47.5%",borderColor:"#000",borderWidth:0,padding:12.5,borderRadius:18,backgroundColor:"#EEE",height:61,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    {loading ?<ActivityIndicator color={"#000"}  size={"small"} />:<Text style={{color:"#000",fontSize:20,fontFamily:"UberMoveMedium"}}>Get demo</Text>}
            </TouchableOpacity>

            </View>


            


                        </>

            :null

          }


          {stage == "book"
          ?<>
          <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
          <TouchableOpacity onPress={()=>setStage("sub")} style={{paddingTop:60,padding:20}}>
                                    <Fontisto name="arrow-left" size={24} color="black" />
                                   
                            </TouchableOpacity>
              <TouchableOpacity onPress={ ()=> setStage("qr") }  style={{padding:2.5,width:"20%",marginRight:20,marginTop:35,borderRadius:180,backgroundColor:"#000",height:40,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}><Text style={{color:"#FFF",fontSize:20,fontFamily:"UberMoveRegular"}}>Done</Text></TouchableOpacity>

              </View>
            <View style={{borderColor:"#555",height:1,borderWidth:0.4,margin:20,marginTop:-5}}></View>
          <WebView source={{uri: 'https://calendly.com/1qr/15mins'}} style={{marginTop:-20}} 
          
          startInLoadingState={true}
            renderLoading={() => {
              return <ActivityIndicator color={"#000"} color={"black"} size={"large"} />
            }} 
          />
          </>
          :null

          }

          {/* {loading
          ?<View style={{backgroundColor:"#000",borderRadius:18,borderWidth:1,borderColor:"#000",width:65,height:65,position:"absolute",top:"45%",left:"40%"}}><ActivityIndicator color={"#000"} color={"#FFF"} size={"small"} style={{marginTop:20}}/></View>
        :null} */}

      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
    

   
  );
}


  
  


const styles = StyleSheet.create({

container: {
    flex: 1,
    backgroundColor:"#FFF"
  },
  inner: {
    padding: 4,
    flex: 1,
    justifyContent: "space-around"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  }
})
