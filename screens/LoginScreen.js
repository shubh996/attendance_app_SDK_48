import React,{useEffect,useRef} from 'react'
import { MaterialIcons,FontAwesome5} from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import {Text, View,TouchableWithoutFeedback, Image,ActivityIndicator,ScrollView,BackHandler,Share,ImageBackground,Animated ,StyleSheet,PixelRatio,Dimensions, Switch,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Fontisto,Ionicons} from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
const { width,height } = Dimensions.get("window");
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';






export default function LoginScreen(props) {

console.log("props ==> ",props?.admin)

  const [uploading, setUploading] = React.useState(false);
  const [phonenumber, setPhonenumber] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);

  const [userData, setUserData] = React.useState({});
  const [admin, setAdmin] = React.useState(props?.admin);
  const [showLoader, setShowLoader] = React.useState(false);
  const QRCode = require('qrcode')
  const [userUID, setUserUID] = React.useState("");
  const [showPrivacyPolicy, setShowPrivacyPolicy] = React.useState(false);
  const [gotopage, setgotopage] = React.useState("new");
  const [showNameModal, setShowNameModal] = React.useState(false);
  const [final, setfinal] = React.useState('');
  const recaptchaVerifier = React.useRef(null);
  const [freeAccount, setFreeAccount] = React.useState(false);
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState('','','','','','');
  const [name,setName] = React.useState("")
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;

  const buttonRef = React.useRef(null);
  let phoneInput = useRef(null);
  let otpinput = useRef(null);

  useEffect(() => {
    firebase.firestore().collection('users').doc("k8kPP10kj6aDg1ChQnETzH1oArf1").onSnapshot(doc => { setFreeAccount(doc?.data()?.free_account_creation)})
}, [])
      


    

  const onSignInSubmit = async() => {

          let number = phonenumber
          number = number.substring(1);

      setUploading(true)

      if(phonenumber.length < 13) return alert("Please enter valid mobile number")
      else{

          try {
            
              const phoneProvider = new firebase.auth.PhoneAuthProvider();
              const verificationId = await phoneProvider.verifyPhoneNumber(phonenumber,recaptchaVerifier.current);    
              setVerificationId(verificationId);
            
              firebase.firestore().collection('att_users').where("phonenumber","==",phonenumber).get().then(querySnapshot => {

                      
                      querySnapshot.forEach(documentSnapshot => {
                              if(documentSnapshot.data().name ) setgotopage("home")
                            })  

              })
              .then(()=> {
                    setUploading(false),
                    setOtpSent(true) 
                })
              .catch((err) => {
                          alert(err);
                      });
              
            } 
                
          catch (err) {
            console.log("ERRRORR ===> ", err)
            firebase.firestore().collection("otp_erros").add({ "phonenumber" : phonenumber})
                  
        }                
  

    
    };
    
    }

  const ValidateOtp =  () => {





    Keyboard.dismiss()

    if ( verificationCode.length !=6|| final === null) return alert("Enter valid OTP")

    setShowLoader(true)

   const credential= firebase.auth.PhoneAuthProvider.credential(verificationId,verificationCode)
   
   firebase.auth().signInWithCredential(credential).then( (result) => {


    setUserUID(result?.user?.uid)

            if(gotopage === "new"){

                    console.log("GO TO PAGE ===> ", result?.user?.uid )
                
                  firebase.firestore().collection("att_users").doc(result?.user?.uid).set({account_type:admin?"admin":"staff","os":Platform.OS,"uid" : result?.user?.uid, "generating_uid" : result?.user?.uid  
                  , "account_created_on" : Date.now() , phonenumber: phonenumber })
                  .then(()=>      firebase.firestore().collection("att_users").doc(result?.user?.uid).collection("stats").doc("timestamp").set({"last_login_at" :[] }) )
                  .then(()=>      firebase.firestore().collection("att_users").doc(result?.user?.uid).collection("stats").doc("visitors").set({"last_visit_at" :[] }) )
                  .then(()=>      firebase.firestore().collection("att_users").doc(result?.user?.uid).collection("stats").doc("login_data").set({"last_login_at" :[] }) )
                  .then(()=>      firebase.firestore().collection("att_users").doc(result?.user?.uid).collection("stats").doc("visitors_data").set({"last_visit_at" :[] }) )
                  .then(()=>      setShowLoader(false))
                  
              } 
              else {
                console.log("OUSIDE NEW ==>" ,result?.user?.uid )
                

              }
              
              
            })
            .catch(err=>{
      
              console.log("err====> " + err)

              if(err.toString().includes("invalid")){

               setVerificationCode( "", "", "", "", "", "",)
               setUploading(false)
        
                return alert("Enter correct OTP")

              }

            
            })
            
    
            
}


      return (

        <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{flex:1,backgroundColor:"#fff",paddingTop:0}}
    >
      {}
      <StatusBar backgroundColor='#FFF' style={'dark'}/>
                  
                  <View style={{ flex: 1}}>
                  {}
                  <FirebaseRecaptchaVerifierModal
                  ref={recaptchaVerifier}
                  firebaseConfig={firebaseConfig}
                  attemptInvisibleVerification={true}
                />
                {}

                

                  { verificationId ?
                  <View style={{marginHorizontal:10,padding:20,position: 'absolute', left: 0, right: 0, top: 0,backgroundColor:"white",borderColor:"#A9A9A9",borderWidth:0}}>

               
                  <Text style={{marginTop:0,marginBottom:5,color:"#000",fontFamily:"UberMoveBold", fontSize:25,}}  >Enter OTP sent to {phonenumber}</Text>
                  <Text style={{marginTop:0,marginBottom:35,color:"#000",fontFamily:"UberMoveMedium",paddingLeft:2.5}}  >If you continue, you agree to out T&C. </Text>
                        
                       


            <TextInput
                          value={verificationCode}
                          autoFocus
                          placeholder='6 digits'
                          keyboardType='number-pad'
                          style={{ width: '100%',fontSize:23, paddingHorizontal:20,height: 80,backgroundColor: '#EEE',borderColor:"#000",borderWidth:0,borderRadius:18,marginBottom:20}}
                          onChangeText={text => {setVerificationCode(text); }}
                      />


                    {verificationCode.length == 6  ?

                   <TouchableOpacity   onPress={()=>ValidateOtp()}   style={{flexDirection:"row",justifyContent:"center",alignItems:"center",height:80,marginVertical:10,backgroundColor:"#000",borderRadius:20}}>
                         
                         <View style={{paddingHorizontal:12.5,width:"100%" }}>

                         {showLoader
                               ?<View style={{flexDirection:"row",fontFamily:"UberMoveLight",justifyContent:"center",alignContent:"center"}}><Text style={{fontSize:20,marginRight:15,marginTop:3.5,fontFamily:"UberMoveRegular",color:"#fff"}}>Please Wait </Text><ActivityIndicator color={"#000"} color="#FFF" size={30} ></ActivityIndicator></View>
                               :  <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",padding:2.5}}><FontAwesome5 name="check" size={30} color="white" /></View>
                           } 
                           
                                
                           
                           </View>
                    </TouchableOpacity>

                           :null}


       </View>
                  :<View style={{marginHorizontal:10,padding:20,position: 'absolute', left: 0, right: 0, top: 0,backgroundColor:"white",borderColor:"#A9A9A9",borderWidth:0,borderRadius:18}}>

               
                               <Text style={{marginTop:0,marginBottom:5,color:"#000",fontFamily:"UberMoveBold", fontSize:25,}}  >Enter your Mobile Number</Text>
                               <Text style={{marginTop:0,marginBottom:25,color:"#000",fontFamily:"UberMoveMedium",paddingLeft:2.5}}  >If you continue, you may receive an SMS for verification.</Text>
                                               
                                <PhoneInput
                                        ref={phoneInput}
                                        defaultValue={phonenumber}
                                        defaultCode="IN"
                                        layout="first"
                                        containerStyle={{ width: '100%',fontSize:30, height: 80,backgroundColor: '#EEE',marginBottom:6,borderRadius:18}}
                                        
                                        textContainerStyle={{ paddingVertical: 0,fontSize:30,fontFamily:"UberMoveMedium",backgroundColor: '#EEE',color:"#fff",borderRadius:18 }}
                                        onChangeFormattedText={text => {setPhonenumber(text); }}
                                        
                                        
                                    />

                            {phonenumber.length == 13 ? verificationId ?null: Keyboard.dismiss() :  null }

                                
                                {
                                    phonenumber.length == 13  ?
                               
                                <TouchableOpacity   onPress={()=>onSignInSubmit()}   style={{flexDirection:"row",justifyContent:"center",alignItems:"center",height:80,marginVertical:10,backgroundColor:"#000",borderRadius:18}}>
                                      
                                      <View style={{paddingHorizontal:15,width:"100%" }}>

                                          {uploading
                                            ?<View style={{flexDirection:"row",fontFamily:"UberMoveLight",justifyContent:"center",alignContent:"center"}}><Text style={{fontSize:20,marginRight:15,marginTop:3.5,fontFamily:"UberMoveRegular",color:"#fff"}}>Sending OTP</Text><ActivityIndicator color={"#000"} color="#FFF" size={30} ></ActivityIndicator></View>
                                            :  <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",padding:5.5}}><FontAwesome5 name="check" size={30} color="white" /></View>
                                        } 
                                        
                                        </View>
                                 </TouchableOpacity>

                                 : null}


                          

             


            
                    </View>
}


       

      {verificationId ?null :           
      <View style={{marginTop:10,paddingTop:20,paddingBottom:10,position:"absolute",bottom:40,left:"35%"}}>
        <TouchableOpacity onPress={()=>setShowPrivacyPolicy(true)} style={{flexDirection:"row",justifyContent:"center",alignContent:"center"}}>
          <Text style={{fontFamily:"UberMoveBold",textAlign:"center",color:"#000"}}>privacy policy </Text>
          <MaterialIcons name="privacy-tip" size={16} style={{paddingLeft:3,marginTop:1}} color="black" />
          </TouchableOpacity>
      </View>}

      <Modal presentationStyle="pageSheet" animationType={"slide"} visible={showPrivacyPolicy}>

     
<WebView source={{uri: 'https://www.privacypolicygenerator.info/live.php?token=rDuVK8iWnpJ6vllYnPykQYXm89RU9OaC'}}   />

<View style={{width:"100%",padding:20,paddingTop:20,paddingBottom:40,backgroundColor:"#000",position:"absolute",bottom:0,width:"100%"}}>
                            
                            <TouchableOpacity onPress={()=> setShowPrivacyPolicy(false)} style={{marginBottom:0,flexDirection:"row",justifyContent:"center"}} >
                            <Fontisto name="close-a" size={Platform.OS === "android" ? 20:22} color="#fff" />
                                    {/* {uploading ? <ActivityIndicator color={"#000"} color={"#FFF"} /> :<Fontisto name="close-a" size={Platform.OS === "android" ? 20:22} color="#fff" />} */}
                            
                            
                            </TouchableOpacity> 
                            
                            </View>


            </Modal>


            </View>
      </KeyboardAvoidingView>
      );
  

  }


  const styles = StyleSheet.create({
    imagecontainer: {
    
     
     width:width-30,
     height:height/4,
     resizeMode:"contain",
      
      
    },
    image: {
        flex: 1,
        justifyContent: "center",
        marginTop:Platform.OS == "ios" ?  45 : 0,
        backgroundColor:"#000"
      },
})
      

