import React, { useState, useEffect } from 'react';
import { Text, View,Dimensions, StyleSheet, Button,Modal, Alert, ActivityIndicator, TouchableOpacity, Linking, Platform, Vibration, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import firebase from '../firebaseConfig';
import { AntDesign,Ionicons,Fontisto, EvilIcons, MaterialCommunityIcons,MaterialIcons,Octicons,FontAwesome5 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import App from '../App';
import { SwipeButton } from 'react-native-expo-swipe-button';
import { LinearGradient } from 'expo-linear-gradient';
import Support from './Support';
import TimerScreen from './TimerScreen';
import * as Permissions from 'expo-permissions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import * as Updates from 'expo-updates';
import { Audio } from 'expo-av';

// import { AdMobInterstitial } from 'expo-ads-admob';
// AdMobInterstitial.setAdUnitID('your-admob-app-id');



export default function ScannerScreen(props) {


      const [hasPermission, setHasPermission] = useState(null);
      const [hasLocationPermission, setHasLocationPermission] = useState(null);
      const [businessData,setBusinessData] =useState({})
      const [staffData,setStaffData] =useState({})
      const [businessUID, setBusinessUID] = useState("");
      const [userScanned, setUserScanned] = useState();
      const [scanned, setScanned] = useState(false);
      const [marked, setMarked] = useState(false);
      const [markingStarted, setMarkingStarted] = useState(false);
      const [showSwipe, setShowSwipe] = useState(false);
      const [checkingDone, setCheckingDone] = useState(false);
      const [showSwipeExit, setShowSwipeExit] = useState(false);
      const [showDistantLottie, setShowDistantLottie] = useState(false);
      const [showGPSLottie, setShowGPSLottie] = useState(false);
      const [tryAgain, setTryAgain] = useState(false);
      const animationRef = React.useRef();
      const animationRefAudio = React.useRef();

      const [wrongQRCode, setWrongQRCode] = React.useState(false);
      const [currentLatitude, setCurrentLatitude] = React.useState(props?.route?.params?.currentLatitude);
      const [currentLongitude, setCurrentLongitude] = React.useState(props?.route?.params?.currentLongitude);
      const [language, setLanguage] = useState(null);
      const [showLanguageModal, setShowLanguageModal] = useState(false);


      console.log("COORDINATES ===>   ", currentLatitude, currentLongitude)


      const english = require('../assets/attendanceenglish.mp3')
      const hindi = require('../assets/attendancehindi.mp3')
      const telugu = require('../assets/attendancetelugu.mp3')
      const kannada = require('../assets/attendancekannada.mp3')





      useEffect( () => {
        animationRef.current?.play()
        animationRefAudio.current?.play()


        firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).onSnapshot((doc)=>{
          setStaffData(doc?.data())

          if(doc?.data().audioLanguage){

            doc?.data().audioLanguage == "english"
              ?setLanguage(require('../assets/attendanceenglish.mp3'))
              :doc?.data().audioLanguage == "hindi"
                ?setLanguage(require('../assets/attendancehindi.mp3'))
                :doc?.data().audioLanguage == "kannada"
                  ?setLanguage(require('../assets/attendancekannada.mp3'))
                  :doc?.data().audioLanguage == "telugu"
                    ?setLanguage(require('../assets/attendancetelugu.mp3'))
                    :null

          }
          else setShowLanguageModal(true)

          firebase.firestore().collection("att_users").doc(doc?.data()?.business_uid).collection("people").doc(doc?.data()?.people_uid).update({"last_login_at": Date.now()})

        })

        getCurrentLocation()
        getCurrentLocation1()
        getCurrentLocation2()

        

      }, [])


  

      const handleRestartApp = async () => {
        try {
          await Updates.reloadAsync();
        } catch (error) {
          console.error('Failed to restart the app:', error);
        }
      };


      const getCurrentLocation=async()=>{

        console.log("getCurrentLocation Started ==> ")

        try{

          const location = await Location?.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 10000,
            maximumAge: 10000
          
          })

          console.log("RESPONSES ==> ", location?.coords)
          setCurrentLatitude(location?.coords?.latitude)
          setCurrentLongitude(location?.coords?.longitude)
          setShowGPSLottie(false)

        }

        catch(error){

          console.log("PROMISE ERROR ---> ", error)
          setShowGPSLottie(true)

        }
      }

      const getCurrentLocation1=async()=>{

        console.log("1 getCurrentLocation Started ==> ")

        try{

          const location = await Location?.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 10000,
            maximumAge: 10000
          
          })

          console.log("RESPONSES ==> ", location?.coords)
          setCurrentLatitude(location?.coords?.latitude)
          setCurrentLongitude(location?.coords?.longitude)
          setShowGPSLottie(false)

        }

        catch(error){

          console.log("PROMISE ERROR ---> ", error)
          setShowGPSLottie(true)

        }
      }


      const getCurrentLocation2=async()=>{

        console.log(" 2 getCurrentLocation Started ==> ")

        try{

          const location = await Location?.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 10000,
            maximumAge: 10000
          
          })

          console.log("RESPONSES ==> ", location?.coords)
          setCurrentLatitude(location?.coords?.latitude)
          setCurrentLongitude(location?.coords?.longitude)
          setShowGPSLottie(false)

        }

        catch(error){

          console.log("PROMISE ERROR ---> ", error)
          setShowGPSLottie(true)

        }
      }

      const exitAudio = async () => {
        try {
          const soundObject = new Audio.Sound();
          await soundObject.loadAsync(language, {shouldPlay: true});
          await soundObject.playAsync();
        } catch (error) {
          console.log('Error playing audio:', error);
        }
      };

      const entryAudio = async () => {
        try {
          const soundObject = new Audio.Sound();
          await soundObject.loadAsync(language,  {shouldPlay: true});
          await soundObject.playAsync();
        } catch (error) {
          console.log('Error playing audio:', error);
        }
      };


      


      useEffect(() => {
        const timer = setTimeout(async () => {

  
          // Add your operation here
          if(currentLongitude) null
          else {
            try {
              await getCurrentLocation();
            } catch (error) {
              console.error('Failed to restart the app:', error);
            }
          }
        }, 2000);
      
        return () => clearTimeout(timer); // Cleanup the timer on component unmount or state change
      }, [currentLongitude]);
      


      useEffect(() => {

        checkCameraPermission();
        checkLocationPermission();

      }, []);

      const checkCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);

        setHasPermission(status === 'granted');
      };

      const checkLocationPermission = async () => {
        setCheckingDone(true)
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        setHasLocationPermission(status === 'granted');
        console.log("LOCATION STATSUSUS ==> ", status )

      };

      function calculateDistance(lat1, lon1, lat2, lon2) {
        console.log("Calculation started",lat1, lon1, lat2, lon2)
        // Earth's radius in meters
        const earthRadius = 6371000;
      
        // Convert latitude and longitude to radians
        const lat1InRadians = toRadians(lat1);
        const lon1InRadians = toRadians(lon1);
        const lat2InRadians = toRadians(lat2);
        const lon2InRadians = toRadians(lon2);
      
        // Calculate the differences between coordinates
        const diffLat = lat2InRadians - lat1InRadians;
        const diffLon = lon2InRadians - lon1InRadians;
      
        // Apply Haversine formula to calculate the distance
        const a =
          Math.sin(diffLat / 2) ** 2 +
          Math.cos(lat1InRadians) * Math.cos(lat2InRadians) * Math.sin(diffLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        // Calculate the distance in meters
        const distance = earthRadius * c;
        console.log("done distance => ",distance)

        return distance;
      }
      
      function toRadians(degrees) {
        return degrees * (Math.PI / 180);
      }

      function timeConverterforHour(UNIX_timestamp){

        
        var a = UNIX_timestamp
        a = (a-(a%1000))/1000
        a = new Date(a*1000)

        var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate().toString().padStart(2, '0');
        var hour = a.getHours();
        var min = a.getMinutes();

        var dateData = (hour + ':' + min).toString()
        return dateData
      }

      function timeConverter(UNIX_timestamp){

        var a = UNIX_timestamp
        a = (a-(a%1000))/1000
        a = new Date(a*1000)

        var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate().toString().padStart(2, '0');
        var hour = a.getHours();
        var min = a.getMinutes();

        var dateData = (year + '-' + month + '-' + date).toString()
        return dateData

      }

      function timeConverterWithoutDate(UNIX_timestamp){

        var a = UNIX_timestamp
        a = (a-(a%1000))/1000
        a = new Date(a*1000)

        var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate().toString().padStart(2, '0');
        var hour = a.getHours();
        var min = a.getMinutes();

        var dateData = (month + '-' + year).toString()
        return dateData

      }

      const getCurrentMonthData =(data)=>{
        const unixTimestamp = Math.floor(Date.now() / 1000);
        const date = new Date(unixTimestamp * 1000);
        const month = date.getMonth();
        const currentMonthInStandardFormat = month + 1;
        const currentMonth = currentMonthInStandardFormat.toString().padStart(2,0) + "-"+ date.getFullYear()
        console.log(currentMonth);
        return currentMonth

    }

      const calculateTimeDiff=(timestamp1,timestamp2)=>{

        // Convert Unix timestamps to milliseconds
        let date1 = new Date(timestamp1 );
        let date2 = new Date(timestamp2 );

        // Calculate the difference in minutes
        let diffMinutes = Math.floor(Math.abs(date2 - date1) / (1000 * 60));

        console.log("diffMinutes ===> ", diffMinutes);
        return diffMinutes


      }

      const lottieOptions = {
        // ...other animation options...
        scale: 0.5, // Change this value to resize the animation
      };


      const markAttendance = async(bLatitude, bLongitude,bUID)=>{

        Vibration.vibrate()

        console.log("Attendance marking started")


        if(scanned){

        setMarkingStarted(true)

        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //   console.log('Permission to access location was denied');
        //   setHasLocationPermission(false)
        //   setShowGPSLottie(true)
        //   return;
        // }

        // let location = await Location.getCurrentPositionAsync({});
        // console.log("LOCATION CORDS ==> ", location?.coords)

        // if(location?.coords || (currentLatitude && currentLongitude)){

          console.log("INSIDE IF CONSIDITOON ")

                if (calculateDistance(currentLatitude ,  currentLongitude, bLatitude, bLongitude) < 100){
            
                      
                      firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(staffData?.people_uid).onSnapshot((documentSnapshot)=>{
                          if(documentSnapshot?.data()?.active_session_id){
                            console.log("INSIDE SESSION DATA ===>", documentSnapshot?.data()?.phonenumber)
                            null
                          }         
                          else firebase.firestore().collection("att_users").doc(bUID ).collection("people").doc(documentSnapshot?.id).collection("attendance").add({in: (Date.now()), date: timeConverter(Date.now()) })
                          .then((res)=>{ 
                            console.log("THEN FUCNTION DATA ===>", res?.id)

                                          firebase.firestore().collection("att_users").doc(bUID ).collection("people").doc(documentSnapshot.id).update({"active_session_id" : res?.id,"last_scanned_at":Date.now()})
                                          firebase.firestore().collection("att_users").doc(props?.route?.params?.uid ).update({"active_session_id" : res?.id,"last_scanned_at":Date.now()}) 
                                          var month_year_exist = false
                                            firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(documentSnapshot?.id).collection("data").where("month_year","==",getCurrentMonthData()).get()
                                                    .then((querySnapshot)=>{
                                                            querySnapshot?.forEach((documentSnapshotForEach)=>{
                                                                month_year_exist = true
                                                                console.log("DOC ID OF MONTH ====> ", documentSnapshotForEach?.id, timeConverter(Date.now()) ==  documentSnapshotForEach?.data()?.last_present_on)
                                                                firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(documentSnapshot?.id).collection("data").doc(documentSnapshotForEach?.id)
                                                                .update({present : timeConverter(Date.now()) ==  documentSnapshotForEach?.data()?.last_present_on 
                                                                  ? documentSnapshotForEach?.data()?.present 
                                                                  : documentSnapshotForEach?.data()?.present+1,
                                                                  last_present_on : timeConverter(Date.now())
                                                                })
                                                          })
                                                    })
                                                    .then(()=>{ 
                                                      
                                                            if(month_year_exist == false){
                                                                  console.log("Month not there" )
                                                                  firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(documentSnapshot?.id).collection("data")
                                                                  .add({ "month_year" :getCurrentMonthData(), "leave" :0, "present" : 1, "absent" : 0,"total_mins_worked_this_month" : 0,"last_present_on" :  timeConverter(Date.now()) })
                                                                }})
                                        
                                        })
                          .then(()=>  {
                            setMarked("entry") 
                            entryAudio()
                            Vibration.vibrate()
                          } )
                          .then(()=>{

                            firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(staffData?.people_uid).collection("attendance").where("date","==",timeConverter(Date.now())).get()
                            .then((querySnapshot)=>{

                              querySnapshot.forEach((documentSnapshot)=>{

                                if(documentSnapshot?.data()?.type){

                                  firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(staffData?.people_uid).collection("data").where("month_year","==",timeConverterWithoutDate(Date.now())).get()
                                  .then((querySnapshot)=>{

                                    querySnapshot?.forEach((doc)=>{


                                      documentSnapshot?.data()?.type == "absent"
                                      ?firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(staffData?.people_uid).collection("data").doc(doc?.id).update({absent : doc?.data()?.absent ?  doc?.data()?.absent - 1 :0 })
                                      :firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(staffData?.people_uid).collection("data").doc(doc?.id).update({leave : doc?.data()?.leave ? doc?.data()?.leave - 1 : 0})


                                      })

                                      firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(staffData?.people_uid).collection("attendance").doc(documentSnapshot?.id).delete()


                                    })

                                  }

                                  })
                                  

                                })
                          
                              })
      
                       })
                      }

                  

                else{

                    setShowDistantLottie(true)
                    setMarkingStarted(false)
                    setShowSwipe(false)

                  }


            //   }
            
            // else{
            //   setShowGPSLottie(true)
            //   setMarkingStarted(false)
            //   setShowSwipe(false)

            // }

              
      }

    }


      const markExit = async(bLatitude, bLongitude,bUID)=>{

        console.log("EXITING marking started")

        setMarkingStarted(true)
        Vibration.vibrate()

        if(scanned){


        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //   console.log('Permission to access location was denied');
        //   setHasLocationPermission(false)
        //   setShowGPSLottie(true)
        //   return;
        // }

      
        // let location = await Location.getCurrentPositionAsync({});
        // console.log("LOCATION CORDS ==> ", location?.coords)

        // if(location?.coords || (currentLatitude && currentLongitude)){

          console.log("INSIDE IF CONSIDITOON ")


                if (calculateDistance(currentLatitude,  currentLongitude, bLatitude, bLongitude) < 100){

                          firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(staffData?.people_uid).onSnapshot((documentSnapshot=>{
                            console.log("EXITINF DATA ===>", documentSnapshot?.data()?.active_session_id)
                            if(documentSnapshot?.data()?.active_session_id){

                              var inTime
                              var outTime
                              var diffTime
                              var inDate

                              

                              firebase.firestore().collection("att_users").doc(bUID ).collection("people").doc(documentSnapshot?.id).collection("attendance").doc(documentSnapshot?.data()?.active_session_id).update({out: (Date.now()) })
                              .then(()=>{
                                firebase.firestore().collection("att_users").doc(bUID ).collection("people").doc(documentSnapshot?.id).collection("attendance").doc(documentSnapshot?.data()?.active_session_id).onSnapshot((doc)=>{
                                  
                                  console.log("INSDEIDE FIREABSE ====>> ",doc?.data()?.in)
                                  
                                  inTime = doc?.data()?.in
                                  outTime = (Date.now())
                                  diffTime = calculateTimeDiff(inTime,outTime)
                                  inDate = doc?.data()?.date
                                })
                              })
                              .then(()=>{ 

                                var workDone = false
                                              firebase.firestore().collection("att_users").doc(bUID ).collection("people").doc(documentSnapshot?.id).update({"active_session_id" : false})
                                              firebase.firestore().collection("att_users").doc(props?.route?.params?.uid ).update({"active_session_id" : false}) 

                                              firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(documentSnapshot?.id).collection("data").where("month_year","==",getCurrentMonthData()).get()
                                                    .then((querySnapshot)=>{
                                                            querySnapshot?.forEach((documentSnapshotForEach)=>{
                                                                console.log("DOC ID OF MONTH ====> ", documentSnapshotForEach?.id, timeConverter(Date.now()) ==  documentSnapshotForEach?.data()?.last_present_on)
                                                                if(workDone == false)firebase.firestore().collection("att_users").doc(bUID).collection("people").doc(documentSnapshot?.id).collection("data").doc(documentSnapshotForEach?.id)
                                                                .update({total_mins_worked_this_month : (documentSnapshotForEach?.data()?.total_mins_worked_this_month || 0) + (diffTime || 0),
                                                                }).then(()=>workDone = true)
                                                          })
                                                    })
                                                   


                              })
                              .then(()=>  {
                                setMarked("exit")
                                exitAudio()
                                Vibration.vibrate()
                              }  )
                            }         

                         }))
      
                  }

                else{

                    setShowDistantLottie(true)
                    setMarkingStarted(false)
                    setShowSwipeExit(false)
                  }
            // }
            // else{
            //   setShowGPSLottie(true)
            //   setMarkingStarted(false)
            //   setShowSwipeExit(false)

            // }

              
      
      
          }}


      const handleBarCodeScanned = ({ type, data }) => {

        console.log("SCANNNED DATA ==> ", data)

        Vibration.vibrate()

        if(data?.split("action")[1] === staffData?.business_uid ){

            setTryAgain(false)
            setScanned(true);
            setBusinessUID(data?.split("action")[1])

            firebase.firestore().collection("att_users").doc(data?.split("action")[1]).onSnapshot(doc=>{
              setBusinessData(doc?.data())
              staffData?.active_session_id ? setShowSwipeExit(true) : setShowSwipe(true)
            })

        }

        else {

          setScanned(true);

          firebase.firestore().collection("att_users").doc(staffData?.business_uid).onSnapshot(doc=>{

            if(doc?.data()?.qrCodeData == data){

              console.log("doc?.data()?.qrCodeData => ", doc?.data()?.qrCodeData, "\n",data)

              setTryAgain(false)
              setScanned(true);
              setBusinessUID(staffData?.business_uid)
              setBusinessData(doc?.data())


              staffData?.active_session_id 
                ? setShowSwipeExit(true) 
                : setShowSwipe(true)

            }

            else{
              setScanned(true)
              setTryAgain(true)
            }

            

          })

      }


        

        

      };

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

     function marker(color, width, height, borderLength ,thickness, borderRadius) {
      return <View style={{ height: height, width: width }}>
        <View style={{ position: 'absolute', height: borderLength, width: borderLength, top: 0, left: 0, borderColor: color, borderTopWidth: thickness, borderLeftWidth: thickness, borderTopLeftRadius: borderRadius }}></View>
        <View style={{ position: 'absolute', height: borderLength, width: borderLength, top: 0, right: 0, borderColor: color, borderTopWidth: thickness, borderRightWidth: thickness, borderTopRightRadius: borderRadius }}></View>
        <View style={{ position: 'absolute', height: borderLength, width: borderLength, bottom: 0, left: 0, borderColor: color, borderBottomWidth: thickness, borderLeftWidth: thickness, borderBottomLeftRadius: borderRadius }}></View>
        <View style={{ position: 'absolute', height: borderLength, width: borderLength, bottom: 0, right: 0, borderColor: color, borderBottomWidth: thickness, borderRightWidth: thickness, borderBottomRightRadius: borderRadius }}></View>
      </View>
    }

    function dateConverter(dateString){

      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var dateParts = dateString.split("-");
      var year = dateParts[0];
      var month = months[(dateParts[1].replace(/^0+/, '')-1)];
      var day = dateParts[2];
      var formattedDate = day + " " + month + " " + year;
      return formattedDate;
      
    }

    function updateLanguage(){

      firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).update({audioLanguage : language})
      setShowLanguageModal(false)
      handleRestartApp()

    }

    
      return (
        <View style={styles.container}>


          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            size={500}
            style={[StyleSheet.absoluteFillObject,{backgroundColor:"#000",width:"100%",height:"100%",justifyContent:"center",flex:1,alignSelf:"center",alignContent:"center",alignItems:"center"}]}
          >
            {marker('white', '72%', '32%', '18%', Platform.OS == "ios" ?18 : 8, 360)}
          </BarCodeScanner>

        {
          staffData?.active_session_id && scanned == false && hasPermission && hasLocationPermission
          ?<TimerScreen  timestamp={staffData?.last_scanned_at} comingFrom={"ScannerScreen"}/>
          :Platform?.OS 
              ?<View style={{flexDirection:"row",justifyContent:"center",width:"100%",alignItems:"center",margin:10,position:"absolute",top:20}}>

                  <Text style={{fontSize:70,fontFamily:"UberMoveBold",color:"#FFF",marginTop:10}}>1QR</Text>

                  </View>
              :null
        }

        

       {scanned 

                ?tryAgain || showGPSLottie
                      ?<View style={{width:"100%",height:"100%",backgroundColor:"#FFF",paddingTop:50}}>
                                    
        
                      <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",margin:10,marginBottom:30}}>
      
                          <Text style={{fontSize:29,fontFamily:"UberMoveBold",color:"#000",marginTop:10,paddingLeft:10}}>{showGPSLottie? "Location Issue":"Invalid QR Code"}</Text>
                          <Text style={{fontSize:15,fontFamily:"UberMoveRegular",color:"#000",marginTop:20,paddingLeft:10}}>{showGPSLottie? "Unable to fetch your current location":"Please ensure you are scanning the correct QR code and try again" }</Text>
      
      
                          </View>

                          <LottieView
                                      ref={animationRef}
                                      autoPlay
                                      loop={true}
                                      style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:0}}
                                      source={require("../assets/qr.json")}
                                    />

<TouchableOpacity 
                                                      onPress={()=> {
                                                        
                                                        dialCall("+916363751774")
                                                        
                                                      
                                                      } } 
                                                      style={{position:"absolute",bottom:90,backgroundColor:"#EEE",padding:20,borderRadius:360,paddingHorizontal:20,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                                      <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",}}>Contact Support</Text>
                                                      </TouchableOpacity>
                        
      
                                    <TouchableOpacity  onPress={()=> { 
                                      setScanned(false)
                                      setShowGPSLottie(false)
                                    } }
                              style={{position:"absolute",borderRadius:360,bottom:10,backgroundColor:"#000",padding:15,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                              <Text style={{fontSize:25,fontFamily:"UberMoveMedium",color:"#FFF",}}>{ "Try Again"}</Text>
                              </TouchableOpacity>
      
                        
      
                        
      
      
      
                          </View> 
                      :showDistantLottie
                        ?<View style={{width:"100%",height:"100%",backgroundColor:"#FFF",paddingTop:30}}>
                                    
        
                    <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",margin:10,marginBottom:30}}>

                        <Text style={{fontSize:52,fontFamily:"UberMoveBold",color:"#000",marginTop:20,paddingLeft:10}}>Alert</Text>
                        <Text style={{fontSize:15,fontFamily:"UberMoveRegular",color:"#000",marginTop:10,paddingLeft:10}}>Please come in office to mark attendance</Text>


                        </View>
                      
                                  <LottieView
                                                ref={animationRef}
                                                autoPlay
                                                loop={true}
                                                style={{flex:1,justifyContent:"center",alignItems:"center",margin:10}}
                                                source={require("../assets/traveller.json")}
                                              />

<TouchableOpacity 
                                                      onPress={()=> {
                                                        
                                                        dialCall("+916363751774")
                                                        
                                                      
                                                      } } 
                                                      style={{position:"absolute",bottom:90,backgroundColor:"#EEE",padding:20,borderRadius:18,paddingHorizontal:20,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                                      <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",}}>Contact Support</Text>
                                                      </TouchableOpacity>
                        
      
                                    <TouchableOpacity  onPress={()=> { setScanned(false)} }
                              style={{position:"absolute",borderRadius:18,bottom:10,backgroundColor:"#000",padding:15,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                              <Text style={{fontSize:25,fontFamily:"UberMoveMedium",color:"#FFF",}}>{ "Try Again"}</Text>
                              </TouchableOpacity>

                        </View> 
                        :showSwipe 
                            ?<View style={{width:"100%",height:"100%",backgroundColor:"#FFF",padding:25,position:"absolute",top:"0%",margin:"0%",borderRadius:18,paddingBottom:10}}>

                                {marked

                                    ?<>
                                        <Text style={{fontSize:40,fontFamily:"UberMoveBold",color:"#000",marginTop:40,paddingLeft:0}}>Checked In</Text>
                                        <Text style={{fontSize:25,fontFamily:"UberMoveRegular",color:"#000",marginTop:10,paddingLeft:0}}>{ timeConverterforHour(Date.now())  }</Text>
                                        <Text style={{fontSize:25,fontFamily:"UberMoveRegular",color:"#000",marginTop:2.5,paddingLeft:0}}>{ dateConverter(timeConverter(Date.now())) }</Text>
                        
                                        <LottieView
                                                      ref={animationRef}
                                                      autoPlay
                                                      loop={true}
                                                      style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:5}}
                                                      source={require("../assets/enter.json")}
                                                    />
                                                      
                                                      <View style={{position:"absolute",bottom:15,left:"7.5%",right:"7.5%"}}>


                                                        <TouchableOpacity 
                              onPress={()=>{
                                console.log("Going to Glance")

                                props?.navigation?.navigate("GlanceScreen",{profileUID : staffData?.people_uid,uid:staffData?.business_uid, comingFrom : "ScannerScreen"})} } 
                              style={{
                                shadowOffset:{width:2,height:1.6},shadowColor:"#000",shadowOpacity:0.1,elevation: 15,
                                backgroundColor:"#EEE",paddingHorizontal:20,borderRadius:18,padding:15, width:"100%",marginTop:15,marginBottom:5,flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                                                                      <Text style={{color:"#000",fontSize:25,fontFamily:"UberMoveRegular"}}>Attendance Data</Text>
                                                                      <Ionicons name="md-document-text-outline" size={30} color="#000" style={{margin:5}} />
                                                                </TouchableOpacity>

                                                                <TouchableOpacity onPress={()=>{ 
                                
                                setScanned(false)
                                setShowSwipe(false)
                                setShowSwipeExit(false)
                                setMarked(false)
                                setMarkingStarted(false) 
                                handleRestartApp()
                              
                              }}

                              style={{
                                shadowOffset:{width:2,height:1.6},shadowColor:"#000",shadowOpacity:0.1,elevation: 15,
                                backgroundColor:"#000",paddingHorizontal:20,borderRadius:18,padding:15, width:"100%",marginTop:15,marginBottom:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                                                                      <Text style={{color:"#FFF",fontSize:25,fontFamily:"UberMoveRegular"}}>Scan Again</Text>
                                                                      <Ionicons name="ios-qr-code-outline" size={26} color="#FFF" style={{margin:5}} />
                                                                      
                                                                </TouchableOpacity>
                                                                      
                                                </View>
                                      </>

                                    :<>
                                          <View style={{}}> 
                                              <Text style={{fontSize:40,fontFamily:"UberMoveBold",color:"#000",marginTop:40,paddingLeft:0}}>{markingStarted ? "Please Wait" :"Mark Entry?"}</Text>
                                              <Text style={{fontSize:22,fontFamily:"UberMoveRegular",color:"#000",marginTop:10,paddingLeft:0}}>{markingStarted ? "Crosschecking GPS Data .." : timeConverterforHour(Date.now()) }</Text>
                                              <Text style={{fontSize:22,fontFamily:"UberMoveRegular",color:"#000",marginTop:2.5,paddingLeft:0}}>{markingStarted ? "Clocking Timestamp .." : dateConverter(timeConverter(Date.now()))  }</Text>
                                          </View>  

                                          
                                     
                                              {markingStarted 
                                                        ?<>

                                                        <LottieView
                                                      ref={animationRef}
                                                      autoPlay
                                                      loop={true}
                                                      style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:100}}
                                                      source={require("../assets/qr.json")}
                                                    />


                                                          </>
                                            
                                                        : <>




                                                            <View style={{position:"absolute",bottom:15,left:"7.5%",right:"7.5%"}}>
                                                                  <SwipeButton
                                                                      Icon={
                                                                        <Fontisto name="arrow-right" size={40} color="#fff" />
                                                                      }
                                                                      iconContainerStyle={{backgroundColor:"#20b001",borderRadius:18}}
                                                                      onComplete={() => {
                                                                        markAttendance(businessData?.latitude, businessData?.longitude, businessData?.uid)
                                                                      }}
                                                                      title="Swipe to Enter"
                                                                      titleContainerStyle={{color:"#000"}}
                                                                      titleStyle={{color:"#000",textAlign:"center",fontFamily:Platform.OS == "ios" ? "UberMoveRegular" : "UberMoveRegular",fontSize: Platform.OS == "ios" ? 25 : 22}}
                                                                      borderRadius={0}
                                                                      containerGradientProps={{
                                                                        colors: ['#EEE', '#EEE'],
                                                                        start: [0, 0.5],
                                                                        end: [1, 0.5],
                                                                      }}
                                                                      underlayTitle="Release"
                                                                      underlayTitleStyle={{color:"#000",fontFamily: "UberMoveRegular",fontSize:20}}
                                                              
                                                                      underlayStyle={{
                                                                        borderRadius: 0,
                                                                      }}
                                                                      underlayContainerGradientProps={{
                                                                        colors: ['#EEE', '#EEE'],
                                                                        start: [0, 0.5],
                                                                        end: [1, 0.5],
                                                                      }}
                                                                    />

                                                              </View>

                                                          </>
                                                        
                                                            
                                                    }
                                              
                                                              
                                    </>

                                }
              
                              </View>
                            :showSwipeExit 
                              ?<View style={{width:"100%",height:"100%",backgroundColor:"#FFF",padding:25,position:"absolute",top:"0%",left:"0%",borderRadius:18,paddingBottom:10}}>

                                      {marked

                                                ?<>
                                                    <Text style={{fontSize:40,fontFamily:"UberMoveBold",color:"#000",marginTop:40,paddingLeft:0}}>Checked Out</Text>
                                                    <Text style={{fontSize:25,fontFamily:"UberMoveRegular",color:"#000",marginTop:10,paddingLeft:0}}>{ timeConverterforHour(Date.now())}</Text>
                                                    <Text style={{fontSize:25,fontFamily:"UberMoveRegular",color:"#000",marginTop:2.5,paddingLeft:0}}>{ dateConverter(timeConverter(Date.now())) }</Text>
                                                    <LottieView
                                                      ref={animationRef}
                                                      autoPlay
                                                      loop={true}
                                                      style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:25}}
                                                      source={require("../assets/chicken.json")}
                                                    />
                                                  
                                                  <View style={{position:"absolute",bottom:15,left:"7.5%",right:"7.5%"}}>

                                                 

                                                        <TouchableOpacity 
                              onPress={()=>{
                                console.log("Going to Glance")

                                props?.navigation?.navigate("GlanceScreen",{profileUID : staffData?.people_uid,uid:staffData?.business_uid, comingFrom : "ScannerScreen"})} } 
                              style={{
                                shadowOffset:{width:2,height:1.6},shadowColor:"#222",shadowOpacity:0.1,elevation: 15,
                                backgroundColor:"#EEE",paddingHorizontal:20,borderRadius:18,padding:15, width:"100%",marginTop:15,marginBottom:5,flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                                                                      <Text style={{color:"#000",fontSize:25,fontFamily:"UberMoveRegular"}}>Attendance Data</Text>
                                                                      <Ionicons name="md-document-text-outline" size={30} color="#000" style={{margin:5}} />
                                                                </TouchableOpacity>

                                                                <TouchableOpacity 
                              onPress={()=>{ 
                                
                                setScanned(false)
                                setShowSwipe(false)
                                setShowSwipeExit(false)
                                setMarked(false)
                                setMarkingStarted(false) 
                                handleRestartApp()
                              
                              }}

                              style={{
                                shadowOffset:{width:2,height:1.6},shadowColor:"#222",shadowOpacity:0.1,elevation: 15,
                                backgroundColor:"#000",paddingHorizontal:20,borderRadius:18,padding:15, width:"100%",marginTop:15,marginBottom:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                                                                      <Text style={{color:"#FFF",fontSize:25,fontFamily:"UberMoveRegular"}}>Scan Again</Text>
                                                                      <Ionicons name="ios-qr-code-outline" size={26} color="#FFF" style={{margin:5}} />
                                                                      
                                                                </TouchableOpacity>
                                                                      
                                                </View>
                                                  </>

                                                :<>
                                    
                                                <Text style={{fontSize:40,fontFamily:"UberMoveBold",color:"#000",marginTop:40,paddingLeft:0}}>{markingStarted ? "Please Wait" :"Mark Exit?"}</Text>
                                                <Text style={{fontSize:22,fontFamily:"UberMoveRegular",color:"#000",marginTop:10,paddingLeft:0}}>{markingStarted ? "Crosschecking GPS Data .." : timeConverterforHour(Date.now()) }</Text>
                                                <Text style={{fontSize:22,fontFamily:"UberMoveRegular",color:"#000",marginTop:2.5,paddingLeft:0}}>{markingStarted ? "Clocking Timestamp .." : dateConverter(timeConverter(Date.now()) ) }</Text>
                                                
                                       
                                                {markingStarted 
                                                          ?<>
  
                                                          <LottieView
                                                        ref={animationRef}
                                                        autoPlay
                                                        loop={true}
                                                        style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:100}}
                                                        source={require("../assets/qr.json")}
                                                      />
  
  
                                                            </>
                                              
                                                          :<>
  
                                                      

                                                              {/* <LottieView

                                                              ref={animationRef}
                                                      autoPlay
                                                      loop={true}
                                                      style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:0}}
                                                      source={require("../assets/scanning.json")}
                                                    /> */}
  
                                                              <View style={{position:"absolute",bottom:20,left:"7.5%",right:"7.5%"}}>
                                                                    <SwipeButton
                                                                        Icon={
                                                                          <Fontisto name="arrow-right" size={40} color="#fff" />
                                                                        }
                                                                        iconContainerStyle={{backgroundColor:"#C70039",borderRadius:18}}
                                                                        onComplete={() => {
                                                                          markExit(businessData?.latitude, businessData?.longitude, businessData?.uid)
                                                                        }}
                                                                        title="Swipe to Exit"
                                                                        titleContainerStyle={{color:"#000"}}
                                                                        titleStyle={{color:"#000",fontFamily:  Platform.OS == "ios" ? "UberMoveRegular" : "UberMoveMedium",fontSize: Platform.OS == "ios" ? 25 : 22}}
                                                                        borderRadius={0}
                                                                        containerGradientProps={{
                                                                          colors: ['#EEE', '#EEE'],
                                                                          start: [0, 0.5],
                                                                          end: [1, 0.5],
                                                                        }}
                                                                        underlayTitle="Release"
                                                                        underlayTitleStyle={{color:"#000",textAlign:"center",fontFamily:"UberMoveRegular",fontSize:20}}
                                                                
                                                                        underlayStyle={{
                                                                          borderRadius: 0,
                                                                        }}
                                                                        underlayContainerGradientProps={{
                                                                          colors: ['#EEE', '#EEE'],
                                                                          start: [0, 0.5],
                                                                          end: [1, 0.5],
                                                                        }}
                                                                      />
  
                                                                </View>
  
                                                            </>
                                                          
                                                              
                                                      }
                                                
                                                                
                                      </>
                                      }
                                    </View>
                              :<View style={{height:"100%",width:"100%",backgroundColor:"#FFF",justifyContent:"center"}}>

                                          <ActivityIndicator color={"#000"}  size={"large"}/>
                                </View>
                
                :<View style={{flexDirection:"row",justifyContent:"space-between",width:"100%",alignItems:"flex-start",margin:10,position:"absolute",bottom:20}}>

                        <Text style={{fontSize:35,fontFamily:"UberMoveMedium",color:"#FFF",marginLeft:10}}>Scan QR Code</Text>

                        <View style={{marginRight:40}}  ><View style={styles.addButton} >
                              <TouchableOpacity
                              
                              onPress={()=>{
                                console.log("Going to Glance")

                                props?.navigation?.navigate("GlanceScreen",{profileUID : staffData?.people_uid,uid:staffData?.business_uid, comingFrom : "ScannerScreen"}) }} 
                              
                              
                              style={{display:"flex",justifyContent:"center",alignSelf:"center",marginTop:3}}>
                                <MaterialIcons name="qr-code-2" size={40} color={ "#FFF"} />
                              </TouchableOpacity>
                          </View>

                          </View>

                  </View>
                    
            }

          {checkingDone && currentLatitude && currentLongitude  
          ? null
          :<>

              {currentLatitude && currentLongitude ? null
                :<View style={{width:"100%",height:"100%",backgroundColor:"#FFF",padding:25,position:"absolute",top:"0%",margin:"0%",borderRadius:18,paddingBottom:10}}>
                
                
                <View style={{}}> 
                    <Text style={{fontSize:40,fontFamily:"UberMoveBold",color:"#000",textAlign:"center",marginTop:40,paddingLeft:0}}>{"Fetching Location" }</Text>
                </View> 

                <>

                                                        <LottieView
                                                      ref={animationRef}
                                                      autoPlay
                                                      loop={true}
                                                      style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:100}}
                                                      source={require("../assets/redpin.json")}
                                                    />


                                                          </>


                </View>

              }

                  


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

            </> 
            }


<Modal presentationStyle="fullScreen" animationType={"slide"} visible={showLanguageModal}>

<ScrollView style={{width:"100%",height:"100%",backgroundColor:"#FFF",padding:25,position:"absolute",top:"0%",margin:"0%",borderRadius:18,paddingBottom:10}}>
                
                
                <View style={{}}> 
                    <Text style={{fontSize:30,fontFamily:"UberMoveBold",color:"#000",textAlign:"left",marginTop:40,paddingLeft:0}}>Audio Language</Text>
                </View>
                <Text style={{fontSize:20,fontFamily:"UberMoveRegular",color:"#222",textAlign:"left",marginTop:5,paddingLeft:0}}>Choose one</Text>


                <View style={{marginTop:25}}>


                      <TouchableOpacity 
                              onPress={()=>{ setLanguage("english") } } 
                              style={{backgroundColor: language == "english" ? "#000" :"#FFF",paddingHorizontal:20,borderRadius:18,borderColor:"#000",borderWidth:1.5,padding:20, width:"100%",marginTop:15,marginBottom:15,
                              height:"17%",shadowOffset:{width:2,height:1.6},shadowColor:"#222",shadowOpacity:0.1,elevation: 15,
                              flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                              <Text style={{color:language == "english" ? "#fff" :"#000",fontSize:25,fontFamily:"UberMoveMedium"}}>English</Text>
                              <Text style={{color:language == "english" ? "#fff" :"#000",fontSize:25,fontFamily:"UberMoveMedium"}}>A z</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                              onPress={()=>{ setLanguage("hindi") } } 
                              style={{backgroundColor: language == "hindi" ? "#000" :"#FFF",paddingHorizontal:20,borderRadius:18,borderColor:"#000",borderWidth:1.5,padding:20, width:"100%",marginTop:15,marginBottom:15,
                              height:"17%",shadowOffset:{width:2,height:1.6},shadowColor:"#222",shadowOpacity:0.1,elevation: 15,
                              flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                              <Text style={{color:language == "hindi" ? "#fff" :"#000",fontSize:25,fontFamily:"UberMoveMedium"}}>Hindi</Text>
                              <Text style={{color:language == "hindi" ? "#fff" :"#000",fontSize:25,fontFamily:"UberMoveMedium"}}>अ क</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                              onPress={()=>{ setLanguage("kannada") } } 
                              style={{backgroundColor: language == "kannada" ? "#000" :"#FFF",paddingHorizontal:20,borderRadius:18,borderColor:"#000",borderWidth:1.5,padding:20, width:"100%",marginTop:15,marginBottom:15,
                              height:"17%",shadowOffset:{width:2,height:1.6},shadowColor:"#222",shadowOpacity:0.1,elevation: 15,
                              flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                              <Text style={{color:language == "kannada" ? "#fff" :"#000",fontSize:25,fontFamily:"UberMoveMedium"}}>Kannada</Text>
                              <Text style={{color:language == "kannada" ? "#fff" :"#000",fontSize:25,fontFamily:"UberMoveMedium"}}>ಅ ಕ</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                              onPress={()=>{ setLanguage("telugu") } } 
                              style={{backgroundColor: language == "telugu" ? "#000" :"#FFF",paddingHorizontal:20,borderRadius:18,borderColor:"#000",borderWidth:1.5,padding:20, width:"100%",marginTop:15,marginBottom:15,
                              height:"17%",shadowOffset:{width:2,height:1.6},shadowColor:"#222",shadowOpacity:0.1,elevation: 15,
                              flexDirection:"row",justifyContent:"space-between",alignItems:"center",}}>
                              <Text style={{color:language == "telugu" ? "#fff" :"#000",fontSize:25,fontFamily:"UberMoveMedium"}}>Telugu</Text>
                              <Text style={{color:language == "telugu" ? "#fff" :"#000",fontSize:25,fontFamily:"UberMoveMedium"}}>క హ</Text>
                      </TouchableOpacity>

                                                                
                                                                      
                </View>




                </ScrollView>


                {language ?<TouchableOpacity onPress={()=>updateLanguage()}  style={{position:"absolute",bottom:15,padding:12.5,width:"90%",margin:"5%",borderRadius:10,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                  <FontAwesome5 name="check" size={30} color="white" />
                </TouchableOpacity>:null}





</Modal>

          

        </View>
      );


    }

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});



