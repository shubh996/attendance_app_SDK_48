import { WebView } from 'react-native-webview';
import React,{useEffect,useRef} from 'react'
import {Card, Text, View,Switch, Badge, TextField} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image,Dimensions ,StyleSheet,PixelRatio,Platform,KeyboardAvoidingView,ScrollView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5,Ionicons , MaterialCommunityIcons} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';
import { Fontisto,Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import * as DocumentPicker from 'expo-document-picker';

import OTPTextView from 'react-native-otp-textinput';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Share } from 'react-native';
;
import RBSheet from "react-native-raw-bottom-sheet";
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import {captureRef} from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export default function StaffSetting(props) {

  const [showOrderModal, setShowOrderModal] = React.useState(false);
  const refRBSheetBuy = React.useRef();
  const [userData, setUserData] = React.useState({});
  const [passcode, setPasscode] = React.useState(["","","",""])
  const [userUID, setUserUID] = React.useState("");
  const [name, setName] = React.useState("");
  const [showDemoRequest, setShowDemoRequest] = React.useState(false);
  const [days, setDays] = React.useState(0);
  const [showNameModal, setShowNameModal] = React.useState(false);
  const refRBSheetOneFeature = React.useRef();
  const refRBSheetQRLink = React.useRef();
  const refRBSheetAuth = React.useRef();
  const refRBSheetLogout = React.useRef();
  const [copiedText, setCopiedText] = React.useState(''); 
  const adminAllowed = ["k8kPP10kj6aDg1ChQnETzH1oArf1"]
  const animationRef = React.useRef();
  let down = useRef(null);

  console.log("PROPS ==> ",props)

  useEffect( () => {
    animationRef.current?.play()
  }, [])


useEffect(() => {

 
        
      setUserUID(props?.route?.params?.uid)

      firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).update({"last_login_at" : Date.now()})

      firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("stats").doc("timestamp").update({"last_login_at" : firebase.firestore.FieldValue.arrayUnion(Date.now())})
      
      getData(props?.route?.params?.uid)

      



    firebase.firestore().collection('att_users').doc(props?.route?.params?.uid).onSnapshot(doc => {  

      if(doc.data().name  ){

        setUserData(doc.data())

        

        if(doc?.data()?.freeTrialStartDate){
        const Diff = Date.now() - doc?.data()?.freeTrialStartDate;
        setDays(Math.round(30 -(Diff / 86400000)))

        }

        if(doc?.data()?.datePaid){

        

          const Diff = Date.now() - doc?.data()?.datePaid;

          doc?.data()?.subType == "monthly" ? setDays(Math.round(30 -(Diff / 86400000))) :setDays(Math.round(365 -(Diff / 86400000)))

        }

        if(doc.data().name){ setName(doc.data().name) }
        else{setName("absent")}
 

       
      }   else{
          

      }

      
    })




}, []);

const url = 'https://1qr.co.in'

const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          ('Try this'+ '\n'+ url )
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

const dialCall = (number) => {
    
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel://${number}`; }
    else {phoneNumber = `telprompt:${number}`; }
    Linking.openURL(phoneNumber);
 };

const convertStampDate = (unixtimestamp)=>{

    if(unixtimestamp == undefined ||  unixtimestamp == null ) return false

    // Months array
    var months_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    // Convert timestamp to milliseconds
    var date = new Date(unixtimestamp);
    
    // Year
    var year = date.getFullYear();
    
    // Month
    var month = months_arr[date.getMonth()];
    
    // Day
    var day = date.getDate();
    
    // Hours
    var hours = date.getHours();
    
    // Minutes
    var minutes = "0" + date.getMinutes();
    
    // Seconds
    var seconds = "0" + date.getSeconds();
    
    // Display date time in MM-dd-yyyy h:m:s format
    var fulldate = month+' '+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    
    // final date
    var convdataTime = day+' '+month+' '+year;
    return convdataTime;

    }

const getData = async (uid) => {
  const res = await axios.get('https://geolocation-db.com/json/')

  const response = Object.assign(res.data, {timestamp : Date.now()})

  firebase.firestore().collection("users").doc(uid).collection("stats").doc("login_data").update({"last_login_at" : firebase.firestore.FieldValue.arrayUnion(response)})
}

const updateName = () => {
  firebase.firestore().collection("users").doc(userUID).update({"name" : name}).then(()=>setShowNameModal(false))
}

const askForDemo =()=>{
  setShowDemoRequest(false)
  firebase.firestore().collection("users").doc(userUID).update({"demoRequested" : true})

}

const authcard =()=>{
  firebase.firestore().collection("users").doc(userUID).update({"lock" : true, "passcode" : passcode})
  refRBSheetAuth.current.close()
}

const downloadQR=async()=>{

  if(Platform.OS == "android"){

    const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
if (perm.status != 'granted') {
return;
}

try {

      const result = await captureRef(down, {
      result: "tmpfile",
      quality: 1,
      format: "png",
    });
    console.log("result",JSON.stringify(result))
const asset = await MediaLibrary.createAssetAsync(result);
console.log("asset",JSON.stringify(asset))
const album = await MediaLibrary.getAlbumAsync('1QR');
console.log("album", JSON.stringify(album))
if (album == null) {
  await MediaLibrary.createAlbumAsync('1QR', asset, false);

} else {
  await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
}
alert("1QR Code is saved to your phone gallery")
} catch (e) {
alert(e);
}

  }

  else{

    try {
    
      const result = await captureRef(down, {
        result: "tmpfile",
        quality: 1,
        format: "png",
      });
      
      MediaLibrary.saveToLibraryAsync(result);
      

      const localuri = await FileSystem.downloadAsync(result, FileSystem.documentDirectory + "filename")
const asset = await MediaLibrary.createAssetAsync(localuri)
const album = await MediaLibrary.createAlbumAsync("DownLoads", asset);


      
    } catch (e) {
      alert("Saved to your phone gallery")
      
    }

  }

  }


return (
    
          <View style={{backgroundColor:"#fff",flex:1}}>
                    

                    <TouchableOpacity style={{backgroundColor:"#fff",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",width:"100%",alignItems:"flex-start",margin:10,marginBottom:15,marginTop:65}} onPress={()=> props?.navigation?.goBack()}>
                    
                        <View style={{flexDirection:"row",justifyContent:"space-evenly",marginLeft:0}}    >
                            <Ionicons name="md-chevron-back-outline" size={32} color="black" />
                        </View>
                        <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginRight:10,marginTop:-2}}>Settings</Text>

                    </TouchableOpacity>

              <ScrollView style={{backgroundColor:"#FFF"}}>

              

              <TouchableOpacity onPress={()=>onShare()} style={{flexDirection:"row",justifyContent:"space-between",alignContent:"center",alignItems:"center",marginHorizontal:20,marginTop:10,borderBottomColor:"#A9A9A9",borderBottomWidth:0,paddingBottom:10}}>

                <View>
                    <Text style={{marginTop:5,color:"#000",fontFamily:"UberMoveMedium",fontSize:23}}  >Invite Staff Member</Text>
                    <Text style={{marginTop:0,color:"#276EF1",fontFamily:"UberMoveRegular"}}  >Send them app link</Text>
                </View>

                <FontAwesome5 name="user-friends" size={16} color="black"  style={{marginTop:5}}/>
              </TouchableOpacity>


              
             
              {/* <TouchableOpacity onPress={()=>Linking.openURL("mailto:cloudio.today@gmail.com?subject=Support/Feedback&body=Hello,")} style={{flexDirection:"row",justifyContent:"space-between",alignContent:"center",alignItems:"center",marginHorizontal:20,marginTop:10,borderBottomColor:"#A9A9A9",borderBottomWidth:0,paddingBottom:10}}>

                <View>
                    <Text style={{marginTop:5,color:"#000",fontFamily:"UberMoveMedium",fontSize:23}}  >Contact Manager</Text>
                    <Text style={{marginTop:0,color:"#276EF1",fontFamily:"UberMoveRegular"}}  >support/feedback</Text>
                </View>

                <MaterialIcons name="email" size={20} color="black"  style={{marginTop:5}}/>
              </TouchableOpacity> */}

              <TouchableOpacity onPress={()=> refRBSheetLogout.current.open()    } style={{flexDirection:"row",justifyContent:"space-between",alignContent:"center",alignItems:"center",marginHorizontal:20,marginTop:10,borderBottomColor:"#A9A9A9",borderBottomWidth:0,paddingBottom:10}}>

                <View>
                    <Text style={{marginTop:5,color:"#000",fontFamily:"UberMoveMedium",fontSize:23}}  >Logout</Text>
                    <Text style={{marginTop:2,color:"#276EF1",fontFamily:"UberMoveRegular"}}  >{userData.phonenumber}</Text>
                </View>

                <FontAwesome5 name="door-open"size={17} color="black"  style={{marginTop:5}}/>
              </TouchableOpacity>

              <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-between",alignContent:"center",alignItems:"center",marginHorizontal:20,marginTop:20,borderBottomColor:"#A9A9A9",borderBottomWidth:0,paddingBottom:10,height:100}}>

                
              </TouchableOpacity>

             
             
              <Modal presentationStyle="pageSheet" animationType={"slide"} visible={showNameModal}>
            <KeyboardAvoidingView  behavior='position'  keyboardVerticalOffset={0}>

            <View style={{width:"90%",margin:20,paddingTop: 10}}>
                              
                              <TouchableOpacity onPress={()=> setShowNameModal(false)} style={{marginBottom:20}} >
                                      <Fontisto name="close-a" size={24} color="black" />
                              </TouchableOpacity>

                              <Text style={{marginTop:5,marginBottom:5,color:"#000",fontFamily:"UberMoveMedium",fontSize:40}}  >Edit Name</Text>
                              <Text style={{marginTop:15,marginBottom:55,color:"#276EF1",fontFamily:"UberMoveRegular"}}  >Please enter your name, it will reflect on your 1QR webpage. You can order a new 1QR card.</Text>

                  
                                                <TextInput
                                                  value={name}
                                                  onChangeText={e => setName( e)}
                                                  placeholder="Enter Full Name"
                                                  clearable
                                                  editable
                                                backgroundColor={"#EEE"}
                                                padding={20}
                                                fontSize={17}
                                                returnKeyType={"done"}
                                                autoCapitalize={"words"}
                                                />
                  
                                      
  <TouchableOpacity onPress={()=>updateName()}  style={{padding:12.5,width:"100%",marginTop:10,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center",display:name.length >3 ? "flex" : "none"}}><Octicons name="check" size={34} color="white" /></TouchableOpacity>
                    
                                          </View>

                                          </KeyboardAvoidingView>
              </Modal>

              </ScrollView>

              <RBSheet
              ref={refRBSheetBuy}
              closeOnDragDown={true}
              closeOnPressMask={true}
              animationType={"slide"}
              customStyles={{
              container:{
              padding:20,
              
              height:"auto",
              width:"100%",
              borderRadius:10,
              


              },
              wrapper: {
              },
              draggableIcon: {
              backgroundColor: "#fff"
              }
              }}
              >


            <View style={{marginTop:-15}}>

              <View style={{flexDirection:"row",justifyContent:"space-between",alignContent:"center",alignItems:"center"}}>

              <View style={{}}>
                <Text style={{color:"#000",fontFamily:"UberMoveMedium",fontSize:35,textAlign:"left"}}  >{ userData?.subType == "monthly" ? "1 Month Plan"  : "1 Year Plan"}</Text>
                </View>
                <TouchableOpacity style={{borderRadius:50,width:"20%",marginTop:-5,backgroundColor:"#048848",shadowOffset:{width:-3,height:4.6},shadowColor:"#000",shadowOpacity:0.41,elevation: 5,}} >
              <Text style={{fontFamily:"UberMoveMedium",fontSize:15, textAlign:"center",color:"#FFF",padding:7.5,paddingHorizontal:5}}>Active</Text>
              </TouchableOpacity>

              </View>
            
              
              <TouchableOpacity onPress={()=>dialCall("+916363751774")}  style={{padding:12.5,width:"100%",marginTop:"14%",backgroundColor:"#000",height:65,flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignSelf:"center",borderColor:"#000",borderWidth:1 }}>
              

              <Text style={{margin:2.5,color:"#FFF",fontFamily:"UberMoveRegular",fontSize:20.5}}  >Contact Us</Text>

              <Octicons name="chevron-right" size={26} color="#FFF" style={{margin:2.5}} />
              </TouchableOpacity>


              <Text style={{paddingTop:10,marginBottom:10,color:"#555",fontFamily:"UberMoveMedium",fontSize:16, textAlign:"center" }}  >Purchased on {convertStampDate(userData?.datePaid)}</Text>

              </View>
              </RBSheet>

              <Modal presentationStyle="pageSheet" animationType={"slide"} visible={showDemoRequest}>
    <>
            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",backgroundColor:"#EEE"}}>
            <TouchableOpacity onPress={()=>askForDemo()} style={{padding:20}}>
                                      <Fontisto name="arrow-left" size={24} color="#000" />
                                    
                              </TouchableOpacity>

                </View>
                <WebView 
              source={{uri: 'https://calendly.com/1qr/15mins'}} 
              style={{marginTop:0}} 
              startInLoadingState={true}
              renderLoading={() => {
                return <ActivityIndicator color={"#000"} color={"black"} size={"large"} />
              }} 

            /></>
              </Modal>

              <RBSheet
              ref={refRBSheetOneFeature}
              closeOnDragDown={true}
              closeOnPressMask={true}
              animationType={"slide"}
              customStyles={{
              container:{
              padding:20,
              
              height:"auto",
              width:"100%",
              borderRadius:10,
              


              },
              wrapper: {
              },
              draggableIcon: {
              backgroundColor: "#fff"
              }
              }}
              >


            <View style={{marginTop:-15,marginBottom:10}}>


                <Text style={{color:"#000",fontFamily:"UberMoveMedium",fontSize:35}}  >1 Feature</Text>
          
                <Text style={{color:"#555",fontFamily:"UberMoveRegular",fontSize:17,paddingTop:10}}  >Using this you can set 1 feature as a direct feature that should operate once someone will scan your 1QR Code</Text>


            
              




              </View>
              </RBSheet>


              <RBSheet
              ref={refRBSheetAuth}
              closeOnDragDown={true}
              closeOnPressMask={true}
              animationType={"slide"}
              customStyles={{
              container:{
              padding:20,
              
              height:"auto",
              width:"100%",
              borderTopLeftRadius:10,
              borderTopRightRadius:10,
              


              },
              wrapper: {
              },
              draggableIcon: {
              backgroundColor: "#fff"
              }
              }}
              >


            <View style={{marginTop:-15,marginBottom:10}}>
            <View >
                              
                            

                              <Text style={{marginTop:-5,marginBottom:5,color:"#000",fontFamily:"UberMoveMedium",fontSize:40}}  >Authentication</Text>
                              <Text style={{marginTop:15,marginBottom:25,color:"#555",fontFamily:"UberMoveRegular",fontSize:19}}  >Please enter 4 digit passcode, this will be required by every scanner to see your 1QR information.</Text>


                              <OTPTextView
            handleTextChange={(e) => setPasscode( e)}
            containerStyle={{marginBottom: 20,}}
            textInputStyle={{ borderRadius: 2, borderWidth: 1,}}
            tintColor="#000"
          />
                                      
  <TouchableOpacity onPress={()=> authcard() }  style={{padding:12.5,width:"100%",marginTop:10,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center",display:passcode.length == 4 ? "flex" : "none",position:"relative"}}><Octicons name="check" size={34} color="white" /></TouchableOpacity>
                    
                                          </View>

              </View>
              </RBSheet>

              <RBSheet
              ref={refRBSheetLogout}
              closeOnDragDown={true}
              closeOnPressMask={true}
              animationType={"slide"}
              customStyles={{
              container:{
              padding:20,
              
              height:"auto",
              width:"100%",
              borderRadius:10,
              


              },
              wrapper: {
              },
              draggableIcon: {
              backgroundColor: "#fff"
              }
              }}
              >


            <View style={{marginTop:-15,marginBottom:10}}>


                <Text style={{color:"#000",fontFamily:"UberMoveMedium",fontSize:25}}  >Logout ?</Text>
          
                <Text style={{color:"#555",fontFamily:"UberMoveRegular",fontSize:20,paddingTop:10}}  >All your data is saved.</Text>



                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"100%",marginVertical:10,marginTop:50}}>
                  <TouchableOpacity onPress={()=> firebase.auth().signOut().then(()=> firebase.auth().signOut()  )} 
                  style={{backgroundColor:"#000",pading:10,width:"48%",height:60,flexDirection:"row",justifyContent:"center",alignItems:"center",borderRadius:20}}><Text style={{fontFamily:"UberMoveRegular",fontSize:20,textAlign:"center",color:"#FFF"}}>Confirm</Text></TouchableOpacity>
                  <TouchableOpacity  onPress={()=> refRBSheetLogout.current.close()} style={{borderRadius:20,backgroundColor:"#EEE",pading:10,width:"48%",height:60,flexDirection:"row",justifyContent:"center",alignItems:"center",}}><Text style={{fontFamily:"UberMoveRegular",fontSize:20,textAlign:"center",color:"#000"}}>Cancel</Text></TouchableOpacity>

                </View>
            
              




              </View>
              </RBSheet>


              {/* <LottieView
                                      ref={animationRef}
                                      autoPlay
                                      loop={true}
                                      style={{flex:1,justifyContent:"center",alignItems:"center"}}
                                      source={require("../assets/camera.json")}
                                    /> */}

            

          </View>
            
    
   
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  actStyle:{

    
    backgroundColor: "#000",
    padding:2,
    borderColor:"#000",
    borderRadius: 6,
    marginTop: 10,
    color:"#FFF",
    width:"100%",width:55,height:55

},
  factStyle:{

    
      backgroundColor: "#048848",
      padding:2,
      borderColor:"#000",
      borderRadius: 6,
      marginTop: 10,
      color:"#FFF",
      width:"100%"

  },
  inactStyle:{

    
      backgroundColor: "#EEE",
      padding:2,
      borderColor:"#000",
      borderRadius: 6,
      marginTop: 10,
      color:"#000",
      width:"100%",width:55,height:55

  },
  image: {
    resizeMode: 'center',
    
},

})
