import React,{useEffect,useRef,useState} from 'react'
import {Card, Text, View} from 'react-native';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5, FontAwesome ,Octicons,Ionicons, Entypo, Foundation, Fontisto} from '@expo/vector-icons';
import { AntDesign,Feather, EvilIcons, MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import LoadingScreen from './LoadingScreen';
import LottieView from 'lottie-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


export default function ShowTimestamp(props) {



  const [currentData, setCurrentData] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(props?.route?.params?.date);
  const [selectedDateString, setSelectedDateString] = React.useState(null);
  const [workingShift, setWorkingShift] = React.useState(null);
  const [startAction, setStartAction] = React.useState(false);
  const [showOvertime, setShowOvertime] = React.useState("");
  const [overtimeUID, setOvertimeUID] = React.useState("");
  const [showOvertimeIcon, setShowOvertimeIcon] = React.useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(props?.route?.params?.isAdmin);
  const [showTick, setShowTick] = React.useState(false);


  const [actionPerformed, setActionPerformed] = React.useState(true);

  
  const [date, setDate] = useState();
  const [datePresent, setDatePresent] = useState(new Date(Date.now()));

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = React.useState(false);


  const refRBSheetBuy = React.useRef();
  const animationRef = React.useRef();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleDateTimeChange = (event, selectedDateTime) => {
    setShowPicker(Platform.OS === 'ios'); // Show picker only on iOS
    if (selectedDateTime) {
      setDateTime(selectedDateTime);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  
  const handleDateConfirm = (date) => {
    console.log('Selected date:', date);

    const dateString = new Date(date);
    const unixTimestamp = dateString.getTime();

    if(selectedTimestamp?.in < unixTimestamp && (Math.floor(selectedTimestamp?.in + 24 * 60 * 60 * 1000 ) >unixTimestamp ) ){
      hideDatePicker()
      setShowTick(true)
      setDate(date)
    } 
      else{

        setDatePickerVisibility(true)
        alert("Please select a valid date")

      
      
    }


    console.log(unixTimestamp);

    
  };

  const handleOpenPicker = () => {
    setShowPicker(true);
  };


  const onChange = (event, selectedDate) => {

    console.log("IOS TIME ==> ",selectedDate)
     
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const onChangePresent = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDatePresent(currentDate);
  };


  useEffect(() => {
    animationRef.current?.play()
  }, [])

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

  


  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours().toString().padStart(2, '0');
    var min = a.getMinutes().toString().padStart(2, '0');
    var sec = a.getSeconds();
    var time =  hour + ':' + min + "  " + date + ' ' + month + ' ' + year;
    return time;
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

  function dateConverterWithoutDate(dateString){

    console.log("dateConverterWithoutDate STARTED ",dateString)


    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dateParts = dateString.split("-");
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];
    var formattedDate = month + "-" + year;
    return formattedDate;
    
  }

  function markActionNow(type){

    var month_year_exist = false

    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("attendance").add({type: type, date: selectedDate}) 
  
    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data").where("month_year","==",dateConverterWithoutDate(selectedDate)).get().then((doc)=>{
      console.log("INDIA ===>",type,dateConverterWithoutDate(selectedDate))
      doc?.forEach((documentSnapshot)=>{
        console.log("documentSnapshot ==> ",documentSnapshot?.id)
        month_year_exist = true
        firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data").doc(documentSnapshot?.id).update({
          leave : type == "leave" ? documentSnapshot?.data()?.leave + 1 : documentSnapshot?.data()?.leave,
          absent : type == "absent" ? documentSnapshot?.data()?.absent + 1 : documentSnapshot?.data()?.absent 
   
        })
  
      })
    }).then(()=>{ 
                
                      if(month_year_exist == false){
                            console.log("Month not there" )
                            firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data")
                            .add({ "month_year" :dateConverterWithoutDate(selectedDate), "leave" :type == "leave" ?1:0, "present" : 0, "absent" : type == "absent" ? 1:0,"total_mins_worked_this_month" : 0,"last_present_on" :  selectedDate })
                          }
  
              })
      .then(()=>{
        setStartAction(false)
        // props?.navigation?.goBack()
    })
  }


  const markAction=(type)=>{


    Alert.alert(type+"?", 'if sure, please click confirm', [
      {
        text: 'Confirm',
        onPress: () => {
          setStartAction(type)
          markActionNow(type)
      },
      },{
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
    ])


  }


  const getTimeString= (avgMins)=>{


    var hours = Math.floor( avgMins / 60);
    var remainingMinutes = Math.floor(avgMins % 60);

    var timeString = (hours || 0) + "hr " + (remainingMinutes || 0) +"min"



    return timeString

  }

  const deleteAction = (type) => {
    
    
    Alert.alert("Delete " + type+"?", 'if sure, please click confirm', [
      {
        text: 'Confirm',
        onPress: () => {


          firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("attendance").doc(currentData?.[0]?.id )?.delete()
        
          firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data").where("month_year","==",dateConverterWithoutDate(selectedDate)).get().then((doc)=>{
            console.log("INDIA ===>",type,dateConverterWithoutDate(selectedDate))
            doc?.forEach((documentSnapshot)=>{
              console.log("documentSnapshot ==> ",documentSnapshot?.id)
              firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data").doc(documentSnapshot?.id).update({
                leave : type == "leave" ? documentSnapshot?.data()?.leave - 1 : documentSnapshot?.data()?.leave,
                absent : type == "absent" ? documentSnapshot?.data()?.absent - 1 : documentSnapshot?.data()?.absent 
        
              })
        
            })
          })

          
      },
      },{
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
    ])


  


  }


  function removelast3numbers(UNIX_timestamp){
    var a = UNIX_timestamp
    a = (a-(a%1000))/1000
  return a
  }

  function convertToFormatDateTime(unixTimestamp){

  const date = new Date(unixTimestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate; // Outputs: "2021-06-26 00:00" for the example Unix timestamp

  }

  const convertToUnix =(datePassed)=>{

    console.log("convertToUnix STARTED ",datePassed)


    if(Platform.OS == "ios"){

    

    const dateString = datePassed?.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const [day, month, year, hour, minute] = dateString.split(/[\/: ]/);

    console.log("step 2 ==>  ",dateString)


    // Adjust month value by subtracting 1 since months are zero-based in JavaScript Date
    const formattedDate = new Date(`${month}/${day}/${year} ${hour}:${minute}`);
    const unixTimestamp = formattedDate.getTime();

    console.log(unixTimestamp); // Outputs the Unix timestamp for the given date and time string
    return (unixTimestamp)

    }

    else{
      const dateString = datePassed;
      const date = new Date(dateString);
      const unixTimestamp = date.getTime() ;

      console.log(unixTimestamp);
      return unixTimestamp
    }




  }

  const calculateTimeDiff=(timestamp1,timestamp2)=>{

    console.log("timestamp1 ==> ", timestamp1,timestamp2)

    // Convert Unix timestamps to milliseconds
    let date1 = new Date(timestamp1 );
    let date2 = new Date(timestamp2 );

    // Calculate the difference in minutes
    let diffMinutes = Math.floor(Math.abs(date2 - date1) / (1000 * 60));

    console.log("diffMinutes ===> ", diffMinutes);
    return diffMinutes


  }


  const updateOutTime= ()=>{

    setLoading(true)
    var allowed = true

    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid ).collection("people").doc(props?.route?.params?.profileUID).collection("attendance")
    .doc(selectedTimestamp?.id).update({out: convertToUnix(date),markedByAdmin: true })
    .then(()=>{
      firebase.firestore().collection("att_users").doc(props?.route?.params?.uid  ).collection("people").doc(props?.route?.params?.profileUID).onSnapshot((doc)=>{
        
        firebase.firestore().collection("att_users").doc(props?.route?.params?.uid  ).collection("people").doc(props?.route?.params?.profileUID).update({"active_session_id" : false})
                      
        console.log("DATA  ===> ",doc?.data()?.main_uid  )

                      
                      firebase.firestore().collection("att_users").doc(doc?.data()?.main_uid  ).update({"active_session_id" : false}) 

                      firebase.firestore().collection("att_users").doc(props?.route?.params?.uid ).collection("people").doc(props?.route?.params?.profileUID).collection("data").where("month_year","==",`${selectedTimestamp?.date.slice(5, 7)}-${selectedTimestamp?.date.slice(0, 4)}`).get()
                            .then((querySnapshot)=>{

                              console.log("inside the ====>>  ", `${selectedTimestamp?.date.slice(5, 7)}-${selectedTimestamp?.date.slice(0, 4)}`)
                                    querySnapshot?.forEach((documentSnapshotForEach)=>{
                                        console.log("DOC ID OF MONTH ====> ", documentSnapshotForEach?.id)
                                        if(allowed) {firebase.firestore().collection("att_users").doc(props?.route?.params?.uid ).collection("people").doc(props?.route?.params?.profileUID).collection("data").doc(documentSnapshotForEach?.id)
                                        .update({total_mins_worked_this_month : (documentSnapshotForEach?.data()?.total_mins_worked_this_month || 0) + (calculateTimeDiff(selectedTimestamp?.in,convertToUnix(date) )   || 0 ),
                                        }).then(()=>{
                                          refRBSheetBuy?.current?.close()
                                          setLoading(false)
                                          allowed = false
                                    
                                        })
                                      }
                                  })
                            })
        
        })
      })
    


  }


  const showAlert=()=>{
    Alert.alert("Contact Manager")
  }





  return ( 

    currentData
      ?<View style={{backgroundColor:"#FFF",flex:1,height:"100%"}}>

              <View style={{justifyContent:"flex-start",alignItems:"flex-start",marginBottom:25,marginTop:Platform.OS === "ios" ? 65 : 50    }}>

                          <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"flex-start",marginLeft:10}}  
                          onPress={()=> props?.navigation?.goBack()}  >
                                  <Ionicons name="md-chevron-back-outline" size={35} color="black" />
                                  <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginLeft:-5}}>{selectedDateString}</Text>
                          </TouchableOpacity>

                      
                                        {currentData[0]?.type || currentData?.length == 0 || startAction ? null :<TouchableOpacity 
                                        onPress={()=>{props?.navigation?.navigate?.("OvertimeScreen",{overtimeUID : overtimeUID,overtime : showOvertime, currentData:currentData[0], uid: props?.route?.params?.uid, profileUID :props?.route?.params?.profileUID, isAdmin:isAdmin })}}
                                        style={{flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"#0047AB",borderColor:"#000",
                                        borderWidth:0,borderRadius:18,paddingHorizontal:15,paddingVertical:10,marginTop:15,marginLeft:23}}>
                                                          <Text style={{fontSize:14,fontFamily:"UberMoveMedium",color:"#FFF"}}>Overtime:</Text>
                                                          <Text style={{fontSize:14,fontFamily:"UberMoveMedium",color:"#FFF",marginLeft:5}}>{(showOvertime || 0 )+ (showOvertime == 1 ? "hr" : "hrs")}</Text>

                                        </TouchableOpacity>}
                                 

                          {currentData?.length == 0 || startAction
                              ? null
                              : currentData[0]?.type 
                                ? <TouchableOpacity 
                                    onPress={()=>!isAdmin ? showAlert() :deleteAction(currentData[0]?.type)}
                                      style={{position:"absolute",right:10,borderRadius:18,marginRight:20,marginTop:3.5}}>
                                    <FontAwesome5 name="trash-alt" size={28} color="#000"  />                             
                                    </TouchableOpacity>
                                : <TouchableOpacity 
                                onPress={()=>{!isAdmin ? showAlert() :
                                  props?.navigation?.navigate?.("EditTimestamp",{uid: props?.route?.params?.uid, profileUID:props?.route?.params?.profileUID, date:props?.route?.params?.date })
                                    
                                }} 
                                  style={{position:"absolute",right:10,borderRadius:18,marginRight:10,marginTop:-3.5}}>
                                <Entypo name="plus" size={45} color="#000"  />                             
                                </TouchableOpacity>                              
                          
                          
                          
                          
                          
                          // || showOvertime 
                          //     ? showOvertimeIcon || showOvertimeIcon == 0 && startAction == false
                          //       ? <TouchableOpacity 
                          //           onPress={()=>!isAdmin ? showAlert() :deleteAction(currentData[0]?.type)}
                          //             style={{position:"absolute",right:10,borderRadius:18,marginRight:20,marginTop:3.5}}>
                          //           <Fontisto name="plus-a" size={28} color="#000"  />                             
                          //           </TouchableOpacity>
                          //       :null 
                          //     : showOvertimeIcon
                          //         ?<View style={{flexDirection:"row",alignItems:"center"}}>
                          //             <TouchableOpacity 
                          //             onPress={()=>{props?.navigation?.navigate?.("OvertimeScreen",{overtimeUID : overtimeUID,overtime : showOvertime, currentData:currentData[0], uid: props?.route?.params?.uid, profileUID :props?.route?.params?.profileUID, isAdmin:isAdmin  })}}
                          //             style={{backgroundColor:"#FFF",position:"absolute",right:10,paddingHorizontal:15,borderRadius:18,marginRight:10}}>
                          //                 <Foundation name="plus"size={30} color="black" />                             
                          //             </TouchableOpacity>
                          //             <TouchableOpacity 
                          //               onPress={()=>{props?.navigation?.navigate?.("OvertimeScreen",{overtimeUID : overtimeUID,overtime : showOvertime, currentData:currentData[0], uid: props?.route?.params?.uid, profileUID :props?.route?.params?.profileUID, isAdmin:isAdmin  })}}
                          //               style={{backgroundColor:"#FFF",position:"absolute",right:10,paddingHorizontal:15,borderRadius:18,marginRight:10}}>
                          //                   <MaterialCommunityIcons name="watch-export" size={30} color="black" />                             
                          //             </TouchableOpacity>
                          //           </View>
                          //         :currentData[0]?.type 
                                      // ? <TouchableOpacity 
                                      //     onPress={()=>!isAdmin ? showAlert() :deleteAction(currentData[0]?.type)}
                                      //       style={{position:"absolute",right:10,borderRadius:18,marginRight:20,marginTop:3.5}}>
                                      //     <FontAwesome5 name="trash-alt" size={28} color="#000"  />                             
                                      //     </TouchableOpacity>
                          //             :currentData?.length == 0 
                          //               ?<TouchableOpacity 
                          //               onPress={()=>!isAdmin ? showAlert() :deleteAction(currentData[0]?.type)}
                          //                 style={{position:"absolute",right:10,borderRadius:18,marginRight:20,marginTop:3.5}}>
                          //               <Foundation name="plus" size={28} color="#000"  />                             
                          //               </TouchableOpacity>
                          //               :null
                            
                          }

              </View>



            <ScrollView style={{margin:10,marginBottom:100}}>


            { currentData?.length != 0 && currentData && startAction == false
            
                ?currentData?.map((data,key)=>{


                  return  data?.type == "absent"
                                ?<View style={{flexDirection:"column"}}>
                                  <Text  style={{fontSize:30,fontFamily:"UberMoveBold",color:"#C70039",marginLeft:5,marginBottom:50}}>Marked as Absent</Text>
                                  <View style={{width:"100%",height:"75%",justifyContent:"center",alignItems:"center"}}>
                                        <LottieView
                                            ref={animationRef}
                                            autoPlay
                                            loop={true}
                                          style={{justifyContent:"center",alignItems:"center"}}
                                            source={require("../assets/absent.json")}
                                          />
                                      </View>
                                  </View>
                                  :data?.type == "leave"
                                      ?<View style={{flexDirection:"column"}}>
                                          <Text  style={{fontSize:30,fontFamily:"UberMoveBold",color:"#FFCE00",marginLeft:5,marginBottom:50}}>Marked as Leave</Text>
                                          <View style={{width:"100%",height:"75%",justifyContent:"center",alignItems:"center"}}>
                                                <LottieView
                                                    ref={animationRef}
                                                    autoPlay
                                                    loop={true}
                                                  style={{justifyContent:"center",alignItems:"center"}}
                                                    source={require("../assets/city.json")}
                                                  />
                                              </View>
                                          </View>
                                      
                                      :data?.overtime
                                        ?null
                                        :<View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>

                                          <View  style={{backgroundColor:"#FFF",borderColor:"#FFF",borderWidth:0.5,borderRadius:18,padding:10,marginBottom:12,paddingVertical:10}}>

                                                    <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:data?.out ?"#000":"#C70039",marginLeft:5}}>{ data?.out ?  timeConverter(data?.out) : "Checkout Pending" }</Text>

                                                    <Entypo name="flow-line" size={40} color="black" style={{marginLeft:5}}/>
                                                    <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",marginLeft:5}}>{timeConverter(data?.in)}</Text>
                                                    {data?.markedByAdmin ? <Text style={{fontSize:13,fontFamily:"UberMoveMedium",color:"#C70039",margin:5}}>Marked by Admin</Text>:null}
                                                </View>

                                                {data?.out ? null 
                                                :<TouchableOpacity onPress={()=>{
                                                  if(isAdmin){
                                                  setShowModal(true)
                                                  setDatePickerVisibility(true)
                                                  setDate(new Date(data?.in))
                                                  setSelectedTimestamp(data)
                                                  }
                                                  else Alert.alert("Contact Manager")
                                                  }}>
                                                <MaterialIcons name="mode-edit" size={30} color="black" style={{marginRight:15,marginTop:-20}}/>
                                                </TouchableOpacity>}

                                        </View>
                                        
                                                             
                      })
                
                :currentData?.length == 0 || startAction
                    ?<View style={{height:"70%",flexDirection:"column",justifyContent:"flex-start",alignItems:"center"}}>

                                <TouchableOpacity onPress={()=>{!isAdmin ? showAlert() :
                                props?.navigation?.navigate?.("EditTimestamp",{uid: props?.route?.params?.uid, profileUID:props?.route?.params?.profileUID, date:props?.route?.params?.date })
                                  
                              }} 
                                  style={{borderRadius:18,marginVertical:20,width:"90%",padding:"5%",backgroundColor:"#0CA92A",flexDirection:"row",justifyContent:"center",alignContent:"center",}}>
                                {startAction  == "present"
                                    ?<ActivityIndicator size={"large"} color={"#000"}/>
                                    :<Text style={{textAlign:"center",color:"#FFF",fontSize:30,fontFamily:"UberMoveMedium"}}>Mark Present</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>!isAdmin ? showAlert() :markAction("absent")} style={{borderRadius:18,width:"90%",padding:"5%",marginVertical:0,backgroundColor:"#C70039",flexDirection:"row",justifyContent:"center",alignContent:"center",}}>
                                    {startAction == "absent"
                                    ?<ActivityIndicator size={"large"} color={"#FFF"}/>
                                    :<Text style={{textAlign:"center",color:"#FFF",fontSize:30,fontFamily:"UberMoveMedium"}}>Mark Absent</Text>
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>!isAdmin ? showAlert() :markAction("leave")} style={{borderRadius:18,marginVertical:20,width:"90%",padding:"5%",backgroundColor:"#FFDE14",flexDirection:"row",justifyContent:"center",alignContent:"center",}}>
                                {startAction  == "leave"
                                    ?<ActivityIndicator size={"large"} color={"#000"}/>
                                    :<Text style={{textAlign:"center",color:"#000",fontSize:30,fontFamily:"UberMoveMedium"}}>Mark Leave</Text>}
                                </TouchableOpacity>


                                



                            </View>
                          :<ActivityIndicator color={"#000"}  size={"large"} style={{margin:20,color:"#000"}}/>
                }


              
              </ScrollView>

              

              {currentData?.length == 0 ? null 
              : <View style={{backgroundColor:"#000",padding:15,borderRadius:18,position:"absolute",bottom:30,width:"90%",left:"5%"}}>
                  <Text style={{fontSize:workingShift ? 30 : 20,fontFamily:"UberMoveRegular",color:"#FFF",textAlign:"center"}}>{ workingShift || "Total Working Hours"}</Text>
                  
                </View>}

                
                <Modal presentationStyle="pageSheet" animationType={"slide"} visible={showModal}>

                <TouchableOpacity style={{backgroundColor:"#fff",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",width:"70%",alignItems:"flex-start",margin:10,marginBottom:15,marginTop:25}} onPress={()=> setShowModal(false)}>
                    
                    <View style={{flexDirection:"row",justifyContent:"space-evenly",marginLeft:0}}    >
                        <Ionicons name="md-chevron-back-outline" size={32} color="black" />
                    </View>
                    <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginRight:10,marginTop:-2}}>Checkout Time</Text>

                </TouchableOpacity>



                                        <View style={{marginTop:0,margin:20,paddingBottom:13}}>

                                      


                                        {/* <View  style={{alignItems:"center",marginTop:50,backgroundColor:"#EEE",padding:20,borderRadius:12,shadowRadius:12,
                                                        shadowOffset:{width:8,height:6.6},shadowColor:"#A9A9A9",shadowOpacity:0.81,elevation: 115,}}>
                                                
                                                <Text style={{fontSize:60,fontFamily:"UberMoveRegular",color:"#000",marginBottom:15}}>{date.toLocaleString()}</Text>
                                                <Text style={{fontSize:22,fontFamily:"UberMoveMedium",color:"#000",marginBottom:5}}>12 Jun 2023</Text>


                                            </View> */}

                                            { Platform.OS == "ios"
                                            
                                            
                                            ?<><DateTimePicker
                                                testID="dateTimePicker"
                                                value={date}
                                                mode={"datetime"}
                                                is24Hour={true}
                                                onChange={onChange}
                                                display={ Platform.OS =="ios" ? "spinner" : "default"}

                                                minimumDate={new Date(convertToFormatDateTime(selectedTimestamp?.in ))} 
                                                maximumDate={new Date(convertToFormatDateTime((selectedTimestamp?.in + 2 * 24 * 60 * 60 )))}
                                              
                                              />
                                              

                                              <TouchableOpacity onPress={()=> {
                                               updateOutTime(date)
                                               setActionPerformed(true)
                                               setShowModal(false)
                                               
                                                                                }}  style={{padding:12.5,marginTop:35,width:"100%",marginHorizontal:"2.5%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                                                                    {loading 
                                                                        ?<ActivityIndicator  color={"#FFF"} size={"small"} />
                                                                        :<FontAwesome5 name="check" size={30} color="white" style={{marginTop:-4}}/>
                                                                    }
                                                        </TouchableOpacity>

                                              <Text style={{fontSize:18,fontFamily:"UberMoveRegular",color:"#000",marginTop:10,textAlign:"center"}}>Selected: {(date?.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}</Text>
                                              
                                              
                                              </>

                                            :<><DateTimePickerModal
                                                isVisible={isDatePickerVisible}
                                                mode="datetime"
                                                onConfirm={handleDateConfirm}
                                                onCancel={()=>{
                                                  setShowModal(false)
                                                  hideDatePicker()
                                                }}
                                               
                                              />

                                              {  showTick  
                                              
                                              
                                              ?<>

                                                <TouchableOpacity 
                                                
                                                onPress={()=> {
                                                  setDatePickerVisibility(true)
                                                  }}
                                                  style={{padding:12.5,marginTop:35,width:"100%",marginHorizontal:"2.5%",borderRadius:18,backgroundColor:"#EEE",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                                                  
                                                  <Text style={{fontSize:18,fontFamily:"UberMoveRegular",color:"#000",marginTop:0,textAlign:"center"}}>Change Timestamp</Text>

                                                </TouchableOpacity>
                                              
                                              
                                                <TouchableOpacity onPress={()=> {
                                                  updateOutTime(date)
                                                  setActionPerformed(true)
                                                  setShowModal(false)

                                                  
                                                  }}  style={{padding:12.5,marginTop:35,width:"100%",marginHorizontal:"2.5%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                                                                        {loading 
                                                                            ?<ActivityIndicator  color={"#FFF"} size={"small"} />
                                                                            :<FontAwesome5 name="check" size={30} color="white" style={{marginTop:-4}}/>
                                                                        }
                                                </TouchableOpacity>
                                      
                                                <Text style={{fontSize:18,fontFamily:"UberMoveRegular",color:"#000",marginTop:10,textAlign:"center"}}>Selected: {(date?.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}</Text>
                                                
                                              
                                              </>
                                                
                                                
                                                :null} 
                                              
                                              </>


                                            }



                   
                                           
                                        
                                        </View>



                </Modal> 

                
              
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

