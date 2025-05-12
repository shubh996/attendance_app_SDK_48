import React,{useEffect,useRef} from 'react'
import {Card, Text, View} from 'react-native';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5, FontAwesome ,Octicons,Ionicons} from '@expo/vector-icons';
import { AntDesign,Feather, EvilIcons, MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import CalendarHeatmap from 'react-native-calendar-heatmap';
import { Calendar,CalendarList } from 'react-native-calendars';
import LottieView from 'lottie-react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { StatusBar } from 'expo-status-bar';
import LoadingScreen from './LoadingScreen';



export default function ViewProfile(props) {

  const [markedDataIn, setMarkedDataIn] = React.useState(null);
  const animationRef = React.useRef();



  useEffect(() => {
    animationRef.current?.play()
  }, [])



  useEffect(() => {

    var markArrayIn = []
    var inside =[]
    var dataIn =[]

    var markArrayOut = []
    var outside =[]
    var dataOut =[]

    var markArrayLeave = []
    var markArrayAbsent = []
    var markArrayOvertime = []

    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("attendance")
    .onSnapshot((querySnapshot) => {

            querySnapshot.forEach((documentSnapshot) => {
                
                dataIn.push(documentSnapshot?.data()?.in)
                dataOut.push(documentSnapshot?.data()?.out)

                documentSnapshot?.data()?.overtime
                  ? markArrayOvertime.push(documentSnapshot?.data()?.date)
                  : documentSnapshot?.data()?.type == "absent" 
                      ? markArrayAbsent.push(documentSnapshot?.data()?.date)
                      : documentSnapshot?.data()?.type == "leave" 
                          ? markArrayLeave.push(documentSnapshot?.data()?.date)
                          : null

            })

            dataIn?.map((data)=>{

                    var a = new Date(data);
                    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
                    var year = a.getFullYear();
                    var month = months[a.getMonth()];
                    var date = a.getDate().toString().padStart(2, '0');
                    var hour = a.getHours();
                    var min = a.getMinutes();

                    var dateData = (year + '-' + month + '-' + date).toString()
                    var timeData = year + '-' + month + '-' + date + ' ' + hour + ':' + min ;

                    markArrayIn.push(dateData)


                })
 
            markArrayIn?.map((data,index)=>{
                inside.push([data,{ selected: true , selectedColor: '#0CA92A', selectedTextColor: '#fff' }])
            })

            markArrayLeave?.map((data,index)=>{
              inside.push([data,{ selected: true , selectedColor: '#FFDE14', selectedTextColor: '#000' }])
            })

            markArrayAbsent?.map((data,index)=>{
              inside.push([data,{ selected: true , selectedColor: '#C70039', selectedTextColor: '#FFF' }])
            })

            markArrayOvertime?.map((data,index)=>{
              inside.push([data,{ selected: true , selectedColor: '#0047AB', selectedTextColor: '#FFF' }])
            })

            setMarkedDataIn(inside.reduce(function(prev,curr){prev[curr[0]]=curr[1];return prev;},{}))

    })

 
}, [])


const getAttData =(date)=>{

    props?.navigation?.navigate?.("ShowTimestamp",{uid: props?.route?.params?.uid,profileUID:props?.route?.params?.profileUID,date:date })
        
}




  return ( 

    markedDataIn
      ?<View style={{backgroundColor:"#FFF",flex:1}}>

              <TouchableOpacity
              onPress={()=>props?.navigation?.goBack() } 

              style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:25,marginTop:Platform.OS === "ios" ? 65 : 50    }}>

                          <View style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"flex-start",marginLeft:10}}  
                          
                          >
                                  <Ionicons name="md-chevron-back-outline" size={35} color="black" />
                                  <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginLeft:-5}}>Calendar</Text>
                          </View>

              </TouchableOpacity>

              <CalendarList  
                    markedDates={markedDataIn}
                    onDayPress={(day) => {
                      console.log("Kya selected ==> ", day)
                      getAttData(day?.dateString)  
                    }}
                    />

             
              
        </View>
      :<View style={{flex:1,width:"100%",height:"100%",backgroundColor:"#FFF"}}>
        <LoadingScreen/>
        </View>

            
   
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1, 
    },
    addButton:{

      
        backgroundColor: "#EEE",
        padding:5,
        paddingHorizontal:10,
        borderColor:"#000",
        borderRadius: 6,
        marginTop: 0,
        color:"#000",
        width:"100%"

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
  tinyLogo: {
    width: 110,
    height: 110,
    borderRadius:360,
    
  },

})

