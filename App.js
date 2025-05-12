import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {ActivityIndicator,Alert, AppRegistry, ScrollView, View, Dimensions, TouchableOpacity, Text, Platform} from 'react-native';
import {name as appName} from './app.json';
import * as Font from "expo-font";
import React,{useEffect} from "react"
import LoginScreen from './screens/LoginScreen';
import { createStackNavigator,CardStyleInterpolators } from '@react-navigation/stack';
import firebase from './firebaseConfig';
import SearchPeople from './screens/SearchPeople';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Location from 'expo-location';
import LoadingScreen from './screens/LoadingScreen';
import Onboarding  from './screens/Onboarding';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import '@firebase/auth';
import AccountSetup from './screens/AccountSetup';
import PaymentScreen from './screens/PaymentScreen';
import OvertimeScreen from './screens/OvertimeScreen';
import AddProfile from './screens/AddProfile';
import HomeScreen from './screens/HomeScreen';
import ViewProfile from './screens/ViewProfile';
import EditProfile from './screens/EditProfile';
import SettingScreen from './screens/SettingScreen';
import ScannerScreen from './screens/ScannerScreen';
import DecideScreen from './screens/DecideScreen';
import StaffSetup from './screens/StaffSetup';
import TestScreen from './screens/TestScreen';
import LottieView from 'lottie-react-native';
import Support from './screens/Support';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StaffSetting from './screens/StaffSetting';
import TimerScreen from './screens/TimerScreen';
import GlanceScreen from './screens/GlanceScreen';
import TabScreen from './navigations/TabScreen';
import NetInfo from "@react-native-community/netinfo";
import NoInterentFound from './screens/NoInterentFound';
import ShowTimestamp from './screens/ShowTimestamp';
import EditTimestamp from './screens/EditTimestamp';
import QRPage from './screens/QRPage';
import PermissionScreen from './screens/PermissionScreen';
import AdminPanel from './screens/AdminPanel';
import GameScreen from './game/GameScreen';
import QuestionScreen from './game/QuestionScreen';
import EditBusiness from './screens/EditBusiness';
// import * as Sentry from "sentry-expo";

// Sentry.init({
//   dsn: "https://21b9d2615460f42ca5d6902a7b1806eb@o4505629491331072.ingest.sentry.io/4505629492576256",
//   enableInExpoDevelopment: true, // Enable Sentry in development mode (optional)
//   debug: true,
// });

const customFonts = {
  UberMoveBold: require("./assets/fonts/UberMoveBold.otf"),
  UberMoveMedium: require("./assets/fonts/UberMoveMedium.otf"),
  UberMoveRegular: require("./assets/fonts/UberMoveRegular.otf"),
  UberMoveLight: require("./assets/fonts/UberMoveLight.otf"),
};
const Stack = createStackNavigator();

// try {
//   Sentry.Native.captureException("app");
// } catch (error) {
//   alert("shubh ===> ", error)
//   Sentry.Native.captureException(error);
// }




export default function App() {

  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = React.useState(false);

  const [gotopage, setgotopage] = React.useState("LoadingScreen");
  const [userUID, setuserUID] = React.useState("");
  const [userData, setUserData] = React.useState({});

  const [stage, setStage] = React.useState("");
  const [latestVersion, setLatestVersion] = React.useState(null);
  const [showNoWifi, setShowNoWifi] = React.useState(false);
  const [currentLatitude, setCurrentLatitude] = React.useState(null);
  const [currentLongitude, setCurrentLongitude] = React.useState(null);


    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      
    });

    // Unsubscribe
    unsubscribe();

    NetInfo.fetch().then(state => {
      
      state.isConnected ==false ? setShowNoWifi(true) : null
    });




  const getData = async (uid) => {
    const response = Object.assign({timestamp : Date.now()})
    firebase.firestore().collection("att_users").doc(uid).update({"last_login_at" : Date.now() })
    firebase.firestore().collection("att_users").doc(uid).collection("stats").doc("login_data").update({"last_login_at" : firebase.firestore.FieldValue.arrayUnion(response)})
  
  }

  useEffect(() => {
    async function setLandscapeOrientation() {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      } catch (error) {
        // Handle the error here, e.g., display a message or fallback to a supported orientation.
        Alert(error.message);
        // Sentry.Native.captureException(error);

      }
    }
    
    setLandscapeOrientation();
    
  }, []);
  



   useEffect(() => {


    (async () => {
      try {

        // Sentry.Native.addBreadcrumb({
        //       type: 'user',
        //       category: 'openApp',
        //       message: 'Loading resources',
        //     });

        await Font.loadAsync(customFonts);
        setLoaded(true);

        // Sentry.Native.addBreadcrumb({
        //   type: 'transaction',
        //   category: 'sentry.transaction',
        //   message: 'Loaded fonts',
        // });


      } 
      
      catch (err) {
        console.log("ERROR of fonts ====> ",err)
        setError(err);
        // Sentry.Native.captureException(error);
      }

    })();


  }), [customFonts];





  const getCurrentLocation=async()=>{

    // console.log("APP>JS FECTHING STARTED ==> ")

    // let location = await Location?.getCurrentPositionAsync({});
    // console.log(" APP>JS CORDS ==> ", location?.coords)

    // setCurrentLatitude(location?.coords?.latitude)
    // setCurrentLongitude(location?.coords?.longitude)

  }


  useEffect(()=>{




    try{


          firebase.auth().onAuthStateChanged(user=>{


            if(user?.phoneNumber){
              firebase.firestore().collection('att_users').where("phonenumber","==",`${user?.phoneNumber}`).get().then((querySnapshot) => {
                querySnapshot?.forEach(documentSnapshot => {

                        setuserUID(documentSnapshot?.id)
                        setUserData(documentSnapshot?.data())
                
                            let DiffPaid = (Math.round(365 -((Date.now() - documentSnapshot?.data()?.datePaid) / 86400000)))
                            let DiffFree = (Math.round(30 -((Date.now() - documentSnapshot?.data()?.freeTrialStartDate) / 86400000)))

                            setStage(documentSnapshot?.data()?.stage)


                            if(documentSnapshot?.data()?.account_type == "admin"){

                              
                            
                              documentSnapshot?.data()?.stage == "done" && documentSnapshot?.data()?.paid 
                              ? DiffPaid > 0 
                                  ? setgotopage("HomeScreen") 
                                  : setgotopage("AccountSetup")
                              : setgotopage("AccountSetup")


                            }

                            else{


                              getCurrentLocation()


                              documentSnapshot?.data()?.stage == "done"
                                  ?setgotopage("ScannerScreen") 
                                  :setgotopage("PermissionScreen") 

                            }

                            
                            getData(documentSnapshot?.id)
                        
                    })    
          })  
            }

            else {
              setgotopage("Onboarding")
            }

            });


    }catch(err){
      console.log("ERRRPR ========> ", err)
    }


    // firebase.firestore().collection('att_users').doc("k8kPP10kj6aDg1ChQnETzH1oArf1").onSnapshot(doc => {  


    //   if(version !== doc?.data()?.latest_version){
    //     setIsUpdateRequired(true)
    //   }
    // })

     



  },[])


  const animationRef = React.useRef();


  useEffect( () => {
      animationRef.current?.play()
  
    }, [])

    console.disableYellowBox = true

  if (error) return <View><Text>{error.message}</Text></View>;
  if (!loaded) return null;

  return (

      <NavigationContainer>
        <StatusBar style={ Platform.OS == "ios" ? "dark" : "light"} backgroundColor='#000'/>
        
      
       { showNoWifi 

        //?<TestScreen/>
        ?<NoInterentFound/>


        :isUpdateRequired


              ?<View style={{width:"100%",height:"100%",backgroundColor:"#FFF",paddingTop:50}}>
                                
              <View style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",margin:10,marginBottom:30}}>

                      <Text style={{fontSize:34,fontFamily:"UberMoveBold",color:"#000",marginTop:10,paddingLeft:10}}>New App Update</Text>
                      <Text style={{fontSize:19,fontFamily:"UberMoveRegular",color:"#000",marginTop:15,paddingLeft:10}}>Please restart the app, to get the latest updates.</Text>
                    </View>
              
              <LottieView
                                              ref={animationRef}
                                              autoPlay
                                              loop={true}
                                              style={{flex:1,justifyContent:"center",alignItems:"center"}}
                                              source={require("./assets/update.json")}
                                            />
                              
              
              <TouchableOpacity 
                                    style={{position:"absolute",bottom:20,backgroundColor:"#000",padding:20,borderRadius:360,paddingHorizontal:20,color:"#FFF",marginLeft:20,fontSize:20,width:"90%",marginBottom:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                    <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#FFF",}}>Restart App</Text>
                                    </TouchableOpacity>




        </View>
                      
              : gotopage == "Onboarding"

                  ?<Onboarding/>
                      
                  :gotopage == "LoadingScreen"

                      ?<LoadingScreen/>

                      :<Stack.Navigator  initialRouteName={gotopage} screenOptions={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                        headerShown :false
                      }}  >


                          <Stack.Screen name="AccountSetup" component={AccountSetup} initialParams={{ uid: userUID ,stage : stage}} />
                          <Stack.Screen name="StaffSetting" component={StaffSetting} initialParams={{ uid: userUID ,stage : stage}} />
                          <Stack.Screen name="StaffSetup" component={StaffSetup} initialParams={{ uid: userUID ,stage : stage}} />
                          <Stack.Screen name="TimerScreen" component={TimerScreen} initialParams={{ uid: userUID ,stage : stage}} />
                          <Stack.Screen name="PaymentScreen" component={PaymentScreen} initialParams={{ uid: userUID }} />
                          <Stack.Screen name="HomeScreen" component={HomeScreen} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="EditProfile" component={EditProfile} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="GlanceScreen" component={GlanceScreen} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="AddProfile" component={AddProfile} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="EditTimestamp" component={EditTimestamp} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="ViewProfile" component={ViewProfile} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="SettingScreen" component={SettingScreen} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="ScannerScreen" component={ScannerScreen} initialParams={{ uid: userUID, phoneNumber:userData?.phonenumber,  currentLatitude : currentLatitude, currentLongitude : currentLongitude }}/>
                          <Stack.Screen name="Support" component={Support}/>
                          <Stack.Screen name="ShowTimestamp" component={ShowTimestamp} initialParams={{ uid: userUID, isAdmin : userData?.account_type == "admin" ? true : false }}/>
                          <Stack.Screen name="OvertimeScreen" component={OvertimeScreen} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="SearchPeople" component={SearchPeople} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="QRPage" component={QRPage} initialParams={{ uid: userUID }}/>
                          <Stack.Screen name="PermissionScreen" component={PermissionScreen} initialParams={{ uid: userUID, phoneNumber:userData?.phonenumber }}/>
                          <Stack.Screen name="AdminPanel" component={AdminPanel} initialParams={{ uid: userUID, phoneNumber:userData?.phonenumber }}/>
                          <Stack.Screen name="GameScreen" component={GameScreen} initialParams={{ uid: userUID, phoneNumber:userData?.phonenumber }}/>
                          <Stack.Screen name="QuestionScreen" component={QuestionScreen} initialParams={{ uid: userUID, phoneNumber:userData?.phonenumber }}/>
                          <Stack.Screen name="EditBusiness" component={EditBusiness} initialParams={{ uid: userUID, phoneNumber:userData?.phonenumber }}/>

                        </Stack.Navigator>

        }
      </NavigationContainer>



  );
}





AppRegistry.registerComponent(appName, () => App)
