import React,{useEffect,useRef,useState} from 'react'
import {Card, Text, View} from 'react-native';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5, FontAwesome ,Octicons,Ionicons, Entypo} from '@expo/vector-icons';
import { AntDesign,Feather, EvilIcons, MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import LoadingScreen from './LoadingScreen';
import LottieView from 'lottie-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import styled from 'styled-components/native'

import SliderCustomLabel from "../constants/SliderCustomLabel";

const textTransformerTimes = (value) => {
  return value === 0
    ? "12am"
    : (value < 13 ? value : value - 12) + (value < 12 ? "am" : "pm");
};


const TIME = {  min: 0,  max: 24 }
const SliderPad = 12;



export default function EditTimestamp(props) {

    const { min, max } = TIME;
    const [width, setWidth] = useState(280);
    const [selected, setSelected] = useState(null);
    const [currentData, setCurrentData] = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState(props?.route?.params?.date);
    const [selectedDateString, setSelectedDateString] = React.useState(null);
    const [workingShift, setWorkingShift] = React.useState(null);
    const [startAction, setStartAction] = React.useState(false);
    const [showOvertime, setShowOvertime] = React.useState("");
    const [overtimeUID, setOvertimeUID] = React.useState("");
    const [showOvertimeIcon, setShowOvertimeIcon] = React.useState(false);
    const [selectedTimestamp, setSelectedTimestamp] = React.useState(null);
    const [loading, setLoading] = React.useState(null);


    useEffect(() => {

        setSelectedDateString(dateConverter(props?.route?.params?.date))
    
        if(startAction == false){
    
        firebase.firestore().collection('att_users').doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("attendance").where("date","==",props?.route?.params?.date)
          .get().then(querySnapshot => {
      
      
            var data = []
            var totaltimeworked = 0
            var tempOvertime = 0
            var tempOvertimeUID 
    
      
            querySnapshot.forEach((documentSnapshot) => {
    
                  data.push({
                    id: documentSnapshot?.id,
                    ...documentSnapshot?.data()})
    
                  // Convert Unix timestamps to milliseconds
                  let date1 = new Date(documentSnapshot?.data()?.in );
                  let date2 = new Date(documentSnapshot?.data()?.out );
    
                  // Calculate the difference in minutes
                  let diffMinutes = Math.floor(Math.abs(date2 - date1) / (1000 * 60));
    
                  if(documentSnapshot?.data()?.out) totaltimeworked = totaltimeworked + diffMinutes
                  else totaltimeworked = totaltimeworked + 0
    
                  tempOvertime = tempOvertime + (documentSnapshot?.data()?.overtime || 0)
    
                  documentSnapshot?.data()?.overtime ? tempOvertimeUID = documentSnapshot?.id  : null
                             
              })
      
              setCurrentData(data)
              setWorkingShift(getTimeString(totaltimeworked))
              setShowOvertime(tempOvertime)
              setOvertimeUID(tempOvertimeUID)
              setShowOvertimeIcon(totaltimeworked)
      
              })
              
            }
      })

      const getTimeString= (avgMins)=>{


        var hours = Math.floor( avgMins / 60);
        var remainingMinutes = Math.floor(avgMins % 60);
    
        var timeString = (hours || 0) + "hr " + (remainingMinutes || 0) +"min"
    
    
    
        return timeString
    
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


  
    if (!selected) {
      setSelected([9, 17]);
    }
  
    // Callbacks
    const onLayout = (event) => {
      setWidth(event.nativeEvent.layout.width - SliderPad * 2);
    };
    const onValuesChangeFinish = (values) => {
      setSelected(values);
    };

    const convertToFirebaseTime=(timeString)=>{
        const [time, date] = timeString.split(' ');

        const [hours, minutes] = time.split(':');
        const [year, month, day] = date.split('-');

        const timestamp = new Date(year, month - 1, day, hours, minutes).getTime() ;

        return timestamp; // Outputs the Unix timestamp for the given time string


    }

    const updateAttendance =()=>{

        var inTime = convertToFirebaseTime(selected[0].toString().padStart(2, '0') + ":00 "+ props?.route?.params?.date)
        var outTime = convertToFirebaseTime(selected[1].toString().padStart(2, '0') + ":00 "+ props?.route?.params?.date)
        const [year, month, day] = props?.route?.params?.date.split('-');
        const formattedMonthYear = `${month}-${year}`;
        const diffMins = (selected[1]-selected[0])*60
        var allowed = true
        console.log("allowed ====> ", allowed)

        setLoading(true)
        var workDone = false

        if(allowed){
            firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).onSnapshot((documentSnapshot)=>{
                firebase.firestore().collection("att_users").doc(props?.route?.params?.uid ).collection("people").doc(documentSnapshot?.id).collection("attendance").add({in: inTime,out: outTime, markedByAdmin: true , date: props?.route?.params?.date})
                .then((res)=>{ 
                    console.log("Attendance UID ===>", res?.id)
    
                                if(allowed){
                                var month_year_exist = false
                                    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(documentSnapshot?.id).collection("data").where("month_year","==",formattedMonthYear).get()
                                    .then((querySnapshot)=>{
                                                    querySnapshot?.forEach((documentSnapshotForEach)=>{
                                                        month_year_exist = true
                                                        console.log("DOC ID OF MONTH ====> ", documentSnapshotForEach?.id, props?.route?.params?.date ==  documentSnapshotForEach?.data()?.last_present_on)
                                                        
                                                        
                                                        if(workDone == false)firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(documentSnapshot?.id).collection("data").doc(documentSnapshotForEach?.id)
                                                        .update({present : props?.route?.params?.date  ==  documentSnapshotForEach?.data()?.last_present_on 
                                                        ? documentSnapshotForEach?.data()?.present 
                                                        : documentSnapshotForEach?.data()?.present+1,
                                                        last_present_on : props?.route?.params?.date,
                                                        total_mins_worked_this_month: (documentSnapshotForEach?.data()?.total_mins_worked_this_month || 0) + (diffMins ||  0)
                                                        }).then(()=>workDone = true)
                                                })
                                                
                                    })
                                    .then(()=>{ 
                                            
                                                    if(month_year_exist == false){
                                                        console.log("Month not there" )
                                                        firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(documentSnapshot?.id).collection("data")
                                                        .add({ "month_year" :formattedMonthYear, "leave" :0, "present" : 1, "absent" : 0,"total_mins_worked_this_month" : diffMins || 0,"last_present_on" :  props?.route?.params?.date })
                                                        }
                                                        
                                    })}
                                
                                })
                .then(()=>  {
                    console.log("REAVHED THEN ", allowed)
                    setLoading(false)
                    allowed = false
                    props?.navigation?.goBack()
                }  )
    
            })
        }

        


}




  return ( 

   <View onLayout={onLayout} style={{backgroundColor:"#fff", height:"100%",flex:1}}>

              <View style={{justifyContent:"flex-start",alignItems:"flex-start",marginBottom:25,marginTop:Platform.OS === "ios" ? 65 : 50    }}>
                          <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"flex-start",marginLeft:10}}  
                          onPress={()=> props?.navigation?.goBack()}  >
                                  <Ionicons name="md-chevron-back-outline" size={35} color="black" />
                                  <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginLeft:-5}}>{ selectedDateString||"Timestamp"}</Text>
                          </TouchableOpacity>
              </View>

        
              <View  style={{alignItems:"center",marginTop:20,backgroundColor:"#FFF",padding:20,borderRadius:12,shadowRadius:12,paddingBottom:50,
                            shadowOffset:{width:8,height:6.6},shadowColor:"#A9A9A9",shadowOpacity:0.81,elevation: 115,margin:20}}>

                <Text style={{fontSize:40,fontFamily:"UberMoveMedium",color:"#000",marginBottom:65}}>{selected?.[1] - selected?.[0]} { selected?.[1] - selected?.[0] ==1 ? "hour" : "hours"}</Text>

                <MultiSlider
                            enableLabel={true}
                            sliderLength={Dimensions.get('window').width/1.4}
                            trackStyle={{ height: 20,borderRadius: 8, }}
                            markerOffsetY={8}
                            selectedStyle={{ backgroundColor: "#000", }}
                            unselectedStyle={{backgroundColor: "#A9A9A9", }}
                            onValuesChangeFinish={onValuesChangeFinish}
                            min={min}
                            max={max}
                            values={selected}
                            allowOverlap={false}
                            customLabel={SliderCustomLabel(textTransformerTimes)}

                           
                            markerStyle={{
                              height: 30,
                              width: 30,
                              borderRadius: 15,
                              
                            }}

                            />
            </View>
{/* 
            <View  style={{backgroundColor:"#FFF",borderColor:"#FFF",borderWidth:0.5,borderRadius:18,padding:15,margin:12,paddingVertical:10}}>

                                                    <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",marginLeft:5}}>{selected?.[0] || "Check In"}</Text>

                                                    <Entypo name="flow-line" size={30} color="black" style={{marginLeft:5}}/>
                                                    <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:data?.out ?"#000":"#0047AB",marginLeft:5}}>{selected?.[1] ||  "Check Out" }</Text>
                                                </View> */}

<TouchableOpacity onPress={()=> updateAttendance() }  style={{position:"absolute",bottom:18,padding:12.5,width:"90%",margin:"5%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                        {loading 
                            ?<ActivityIndicator  color={"#FFF"} size={"small"} />
                            :<FontAwesome5 name="check" size={30} color="white" style={{marginTop:-4}}/>
                        }
            </TouchableOpacity>

                
              
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
