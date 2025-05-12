import { WebView } from 'react-native-webview';
import React,{useEffect,useRef} from 'react'
import {Card, Text, View,Switch, Badge} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image,Dimensions ,StyleSheet,PixelRatio,Platform,KeyboardAvoidingView,TouchableWithoutFeedback,Button,ScrollView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { Octicons,Entypo,Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import QRCode from 'react-native-qrcode-svg';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import LottieView from 'lottie-react-native';
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



export default function StaffSetup(props) {

  var hours = new Date().getHours();
  const [greeting, setGreeting] = React.useState( hours > 4 && hours <12 ?"Good Morning" : hours > 12 && hours <16 ? "Good Afternoon" : hours > 16 && hours <22 ?"Good Evening" : hours > 16 && hours <23 ?"Good Night" : hours > 0 && hours <4 ?"Good Night" :"Welcome"  );
  const [name, setName] = React.useState("");
  const [stage, setStage] = React.useState("name");
  const [userData, setUserData] = React.useState({});
  const [wrongQRCode, setWrongQRCode] = React.useState(false);
  const [latitude, setLatitude] = React.useState(null);
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [showTestNoti, setShowTestNoti] = React.useState(false);
  const [notification, setNotification] = React.useState(false);
  const [freeAccount, setFreeAccount] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [peopleData, setPeopleData] = React.useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [imageLoading, setImageLoading] = React.useState(false);
  const animationRef = React.useRef();
  const animationRefLoad = React.useRef();
  const [scanned, setScanned] = React.useState(false);
  const [address, setAddress] = React.useState("");



    useEffect(() => {
        animationRef.current?.play()
        animationRefLoad.current?.play()

    }, [])

    useEffect(() => {
        firebase.firestore().collection('att_users').doc(props?.route?.params?.uid).onSnapshot(doc => {   setUserData(doc.data())    })

    }, []);


    const updateName = (data) => {


    var found = false

    console.log("Datat in updatnamne===> ", data)

    if(data) {
        setLoading(true)
        firebase.firestore().collection("att_users").where("uid","==",data).get().then((querySnapshot)=>{
            querySnapshot.forEach((documentSnapshot)=>{
                found = true
                firebase.firestore().collection("att_users").doc(userData?.uid).update({"business_uid": data,"name":documentSnapshot?.data()?.name,"stage":"sub"})
                .then(()=>{setStage("sub"), setLoading(false)})
                .then(()=>{
                    firebase.firestore().collection("att_users").doc(data).collection("people").onSnapshot((querySnapshot) => {
        
                        var data = []
                        querySnapshot.forEach((documentSnapshot) => {
                          documentSnapshot?.data()?.main_uid
                          ? null 
                          :data.push({
                                uid : documentSnapshot?.id,
                                ...documentSnapshot?.data()
                                })
                        })

                        setPeopleData(data)
                    })
                })
            })
        }).then(()=>{

            setLoading(false)
            found ? null : alert("Please scan correct QR Code")
            
        })
        }
        else {
            setLoading(false) 
            return alert("Invalid QR Code")
        }


        

    }

    const selectPeople =(data)=>{
        console.log("Selected Data ===> ",data)

        Alert.alert(`Are you ${data?.name}?`, 'please confirm', [
            {
              text: 'Confirm',
              onPress: () => {
                firebase.firestore().collection("att_users").doc(userData?.business_uid).collection("people").doc(data?.uid).update({"phonenumber":userData?.phonenumber, "main_uid":userData?.uid}).then(()=>{
                    firebase.firestore().collection("att_users").doc(userData?.uid).update({"stage":"done","people_uid":data?.uid})
                }).then(()=> props?.navigation?.navigate("ScannerScreen"))}
            },{
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
          ]);
     

    }


    const handleBarCodeScanned = ({ type, data }) => {

      setScanned(true)


      if(data?.split("action")[1]){
        console.log("SATA +++>>> ", data)

        updateName(data?.split("action")[1])
        setName(data?.split("action")[1])
      }
      else {

        setScanned(true);
        var found = false

        console.log("ELSE +++>>> ", data)


        firebase.firestore().collection("att_users").where("qrCodeData","==",data).get().then((doc)=>{

          doc?.forEach((documentSnapshot)=>{

            console.log("CODE DATA ==> ", documentSnapshot?.data())
            found = true

            updateName(documentSnapshot?.data()?.uid)
            setName(documentSnapshot?.data()?.uid)

          }) }).then(()=>{

            if(found == false){
              setWrongQRCode(true)
              setScanned(false)

            }

          })

    }



    };



  return (
    <View style={styles.container}>

                  {stage== "name" 
                              
                            ?<>
                            
                                    <BarCodeScanner
                                      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                      style={[StyleSheet.absoluteFillObject,{backgroundColor:"black"}]}
                                    />
                                            
                                    {scanned 
                                          ?null
                                          :wrongQRCode 
                                                  ? <Text style={{fontSize:20,position:"absolute",bottom:30,backgroundColor:"#FF0000",margin:20,padding:10,fontFamily:"UberMoveBold",color:"#fff"}}>Please Scan Correct QR Code</Text>
                                                  :<View style={{position:"absolute",bottom:25,left:25}} >
                                                      <Text style={{fontSize:35,fontFamily:"UberMoveBold",color:"#FFF"}}>Scan QR Code</Text>
                                                      <Text style={{fontSize:15,fontFamily:"UberMoveRegular",color:"#FFF"}}>Register to your business</Text>

                                                    </View>
                                      }


                               </>
                            
                            :<>
                                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:25,marginTop:60}}>
                
                                      <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",marginLeft:10}}  onPress={()=> {
                                                setStage("name")
                                                setScanned(false)
                                                }}  >
                                              <Ionicons name="md-chevron-back-outline" size={34} color="black" />
                                            
                                      </TouchableOpacity>
                
                                      <Text style={{fontSize:30,fontFamily:"UberMoveBold",color:"#000",marginRight:20}}>Select</Text>
                                      
                                    </View>
                 
                                    {peopleData 
                                                    ?<ScrollView style={{backgroundColor:"#FFF",padding:10,marginBottom:100}}>
                                                                <View style={{flexDirection:"row",flex:1,flexWrap:"wrap",width:"100%",justifyContent:"flex-start",alignItems:"center"}}>
                                                                        
                
                                                              {  peopleData.map((data,key)=>{
                                                    
                                                                        return <TouchableOpacity id={key} style={{margin:9.5}}  onPress={()=> selectPeople(data)  }  >
                                                                                                                        
                                                                                                                        <View style={{borderWidth:1, width: windowWidth/5,
                                                                                                                            backgroundColor:"#EEE",borderRadius:360, borderColor :   "#FFF"}}>
                
                                                                                            <Image
                                                                                                    style={ styles.tinyLogo }
                                                                                                    source={{ uri: data?.image}}
                                                                                                    onLoadStart={()=>setImageLoading(true)}
                                                                                                    onLoadEnd={()=>setImageLoading(false)}
                
                                                                                                />
                                                                                        
                                                                                        </View>
                                                                                          
                
                
                                                                                                
                                                                                        
                                                                                
                
                                                                                    <Text style={{marginTop:5,textAlign:"center",color:"#000",fontFamily:"UberMoveMedium",fontSize:14,}} numberOfLines={1} >{ ((data?.name)?.split(" ")[0].length > 8) ? (((data?.name?.split(" ")[0]).substring(0,8-2)) + '...') : data?.name?.split(" ")[0] }</Text>
                
                                                                                </TouchableOpacity>;
                                                                    })}
                
                                                                          
                                                                </View>
                                                                
                                                                </ScrollView>
                                                    :<View style={{flex:1,width:"60%",marginLeft:"18%",marginTop:-100}}>
                                                      <LottieView
                                                          ref={animationRef}
                                                          autoPlay
                                                          loop={true}
                                                          style={{flex:1,justifyContent:"center",alignItems:"center"}}
                                                          source={require("../assets/qr.json")}
                                                        />
                                                    </View>
                                            }
                              
                                    <View style={{position:"absolute",bottom:30,flexDirection:"row",justifyContent:"space-between",width:"90%",left:"6%",alignItems:"center"}}>
                
                
                                      <TouchableOpacity onPress={()=> firebase.auth().signOut()} 
                                    style={{width:"100%",borderColor:"#000",borderWidth:0,padding:15,borderRadius:360,backgroundColor:"#000",height:65,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                      <Text style={{color:"#fff",fontSize:20,fontFamily:"UberMoveMedium"}}>Logout</Text></TouchableOpacity>
                                    </View>
         
                            </>

                    }


    </View>
      

    
    );
  }


  
  


const styles = StyleSheet.create({

container: {
    flex: 1,backgroundColor:"#FFF"
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
  },
  tinyLogo: {
    width: 70,
    height: 70,
    borderRadius:360
  },
})
