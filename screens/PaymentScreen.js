import React,{useEffect,useRef} from 'react'
import {Card, Text, View} from 'react-native';

import firebase from '../firebaseConfig';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';

import { Fontisto } from '@expo/vector-icons';

import { WebView } from 'react-native-webview';

import {  Linking, StatusBar } from 'react-native-web';


export default function PaymentScreen(props,navigation) {

  


  const [userData, setUserData] = React.useState({});
  const [phoneNumber, setPhoneNumber] = React.useState({});

  const [userUID, setUserUID] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  let animation = React.useRef();

  useEffect(() => {
    animation?.current?.play()
    
    
}, [])


  useEffect(() => {
        setUserUID(props?.route?.params?.uid)

        console.log("inside normal useeffect> ", props?.route?.params?.uid)



      firebase.firestore().collection('att_users').doc(props?.route?.params?.uid).onSnapshot(doc => { 

              setUserData(doc?.data())
              setPhoneNumber(doc?.data()?.phonenumber)
              

      })


  }, []);


  useEffect(() => {
    console.log("payment useeffect ",phoneNumber )



    firebase.firestore().collection('att_payment').where("phonenumber","==",phoneNumber).onSnapshot(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {

        console.log("isnide payment")


              console.log("DATA ==> " , JSON.stringify(documentSnapshot?.data()))

              if(documentSnapshot?.data()?.status == "captured"){

                
                firebase.firestore().collection("att_users").doc(userData?.uid).update({ 
                  subType : documentSnapshot?.data()?.amount == "9900" ? "montly": "yearly",
                  stage:"done",paid:true  ,datePaid:Date.now() })
                .then(()=>{props?.navigation?.navigate("HomeScreen")})
              }
              

          }) 

})
  


}, [phoneNumber]);



 
  return ( 

<>
<StatusBar></StatusBar>


<View style={{width:"100%",padding:20,paddingTop:50,backgroundColor:"#000"}}>
                            
<TouchableOpacity onPress={()=> props?.navigation?.navigate("AccountSetup")} style={{margin:5,flexDirection:"row",justifyContent:"left"}} >
        <Fontisto name="close-a" size={Platform.OS === "android" ? 20:22} color="#fff" />


</TouchableOpacity> 

</View>



<WebView source={{uri: 
props?.route?.params?.subType == "monthly" ? 
`https://pages.razorpay.com/pl_Lt8kwbLi2UDRPT/view?phone_number=${userData?.phonenumber}&full_name=${userData?.name}`
:`https://pages.razorpay.com/pl_Lt8lcRXEk63LJu/view?phone_number=${userData?.phonenumber}&full_name=${userData?.name}`

}} 
renderLoading={() => {
  return <ActivityIndicator color={"#000"} color={"black"} size={"large"} />
}} 
/>

<View style={{paddingTop:25,backgroundColor:"#FFF"}}></View>

</>

   


            
   
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

