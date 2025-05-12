import React,{useEffect,useRef} from 'react'
import {Card, Text, View} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { Entypo,Octicons,Ionicons } from '@expo/vector-icons';
import LoadingScreen from './LoadingScreen';
import { getDocumentAsync } from 'expo-document-picker';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import LottieView from 'lottie-react-native';
import TimerScreen from './TimerScreen';
import moment from 'moment'
import RBSheet from "react-native-raw-bottom-sheet";


const GlanceScreen = (props,navigation) =>{


  const [showTimer, setShowTimer] = React.useState(false);
  const [startTime, setStartTime] = React.useState(null);
  const [latestTime, setLatestTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [everyMonth, setEveryMonth] = React.useState(null);
  const animationRef = React.useRef();
  const [userData, setUserData] = React.useState([]);
  const refRBSheetBuy = React.useRef();
  const [showOption, setShowOption] = React.useState(false);
  const [currentMonthUID, setCurrentMonthUID] = React.useState("");
  const [currentPeopleData, setCurrentPeopleData] = React.useState({});
  const [currentMonthData, setCurrentMonthData] = React.useState(null);
  const [currentMonthString, setCurrentMonthString] = React.useState(null);
  const [propsProfileUID, setPropsProfileUID] = React.useState(props?.route?.params?.profileUID || props?.profileUID);
  const [propsUID, setPropsUID] = React.useState(props?.route?.params?.uid || props?.uid);



  useEffect(() => {
    animationRef.current?.play()

  }, [])


  const convertToStringOfMonthYear =(data)=>{

    const [month, year] = data.split('-');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  
    const formattedDate = `${months[parseInt(month) - 1]} '${year.toString().substring(year.length - 2)}`;
    console.log("convertToStringOfMonthYear ====>", formattedDate)
    return formattedDate;

  }




  useEffect(() => {

    var dataNow = []
    var eMonth = []
    var tempLatestTime = []
    var tempEndTime = []
    var tempTime = 0


    firebase.firestore().collection("att_users").doc(propsProfileUID).onSnapshot((doc)=>{
                    

                    const unixTimestamp = Math.floor(Date.now());
                    const date = new Date(unixTimestamp);
                    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                    setCurrentMonthString(months[date.getMonth()] + ` '`+ date?.getFullYear()?.toString()?.slice(-2));
                    const month = date.getMonth();
                    const day = date.getDate()
                    const currentMonthInStandardFormat = month + 1;
                    const currentMonth = currentMonthInStandardFormat.toString().padStart(2,0) + "-"+ date.getFullYear()
                    const todayDate = day.toString().padStart(2,0) + "-"+currentMonthInStandardFormat.toString().padStart(2,0) + "-"+ date.getFullYear()


                    firebase.firestore().collection('att_users').doc(propsUID|| props?.uid).collection("people").doc(propsProfileUID).onSnapshot(doc=>{setUserData(doc?.data()) })
                    firebase.firestore().collection('att_users').doc(propsUID|| props?.uid).collection("people").doc(propsProfileUID).collection("data").get().then(querySnapshot=>{

                        querySnapshot?.forEach((documentSnapshot)=>{

                            eMonth.push({string:convertToStringOfMonthYear(documentSnapshot?.data()?.month_year), number:documentSnapshot?.data()?.month_year})

                        })

                        setEveryMonth(eMonth)

                    })


                    firebase.firestore().collection('att_users').doc(propsUID || props?.uid).collection("people").doc(propsProfileUID).collection("data")
                        .where("month_year","==",currentMonth).get().then((querySnapshot)=>{
                            querySnapshot?.forEach((documentSnapshot)=>{
                                dataNow.push(documentSnapshot?.data())
                                setCurrentMonthUID(documentSnapshot?.id)
                                firebase.firestore().collection('att_users').doc(propsUID || props?.uid).collection("people").doc(propsProfileUID).collection("data").doc(documentSnapshot?.id).onSnapshot((querySnapshot)=>{setCurrentMonthData(querySnapshot?.data()) })
                                
                                
                                // firebase.firestore().collection('att_users').doc(propsUID|| props?.uid).collection("people").doc(propsProfileUID).collection("attendance")
                                // .where("date","==",todayDate).orderBy("in",'asc').get()
                                // .then((doc)=>{

                                //     doc?.forEach((snapData)=>{
                                //         tempStartTime.push(snapData?.data()?.in)
                                        
                                //         if(snapData?.data()?.out){

                                //             tempTime = tempTime + calculateMilliseconds(snapData?.data()?.in,snapData?.data()?.out)

                                //         }
                                        
                                //     })

                                //     setStartTime(tempStartTime[0] ) 
                                //     setTotalTime(tempTime)
                                //     setShowTimer(true)                                   

                                // })
                                // firebase.firestore().collection('att_users').doc(propsUID|| props?.uid).collection("people").doc(propsProfileUID).collection("attendance")
                                // .where("date","==",todayDate).orderBy("in",'desc').get()
                                // .then((doc)=>{

                                //     doc?.forEach((snapData)=>{
                                //         tempEndTime.push(snapData?.data()?.out)
                                //         tempLatestTime.push(snapData?.data()?.in)
                                //     })

                                //     setEndTime(tempEndTime[0] )
                                //     setLatestTime(tempLatestTime[0] ) 
                                //     console.log("LASTEST TIME IN", tempLatestTime[0])

                                //     setShowTimer(true)                                   

                                // })



                            })                               
                    }).then(()=>{
                        setShowOption(true)
                       
                    }).catch(()=>alert("Contact Support"))


                    
                
              

    })

  }, []);


  function timeConverter(UNIX_timestamp){

    if(UNIX_timestamp){

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

    else return null

    
  }


  const getMonthData =(date)=>{

    const data = date?.number

    console.log("data ===> ", data, propsUID, props?.uid, propsProfileUID)

    firebase.firestore().collection('att_users').doc(propsUID || props?.uid).collection("people").doc(propsProfileUID).collection("data")
    .where("month_year","==",data).get().then((querySnapshot)=>{
        querySnapshot?.forEach((documentSnapshot)=>{
            console.log("documentSnapshot?.data()" , documentSnapshot?.id)
            setCurrentMonthUID(documentSnapshot?.id)
            console.log("1" , documentSnapshot?.id)
            setCurrentMonthString(date?.string)

            firebase.firestore().collection('att_users').doc(propsUID || props?.uid).collection("people").doc(propsProfileUID).collection("data").doc(documentSnapshot?.id).onSnapshot((querySnapshot)=>{
                setCurrentMonthData(querySnapshot?.data())
                console.log("2" , documentSnapshot?.id)

            })
        
        })                               
        }).then(()=>{
            setShowOption(true)
            refRBSheetBuy.current.close()
        
        }).catch((err)=>alert("Contact Support", err))    



  }






  const calculateAvgTime= ()=>{

    const avgMins= currentMonthData?.total_mins_worked_this_month/currentMonthData?.present

    var hours = Math.floor( avgMins / 60);
    var remainingMinutes = Math.floor(avgMins % 60);

    var timeString = (hours || 0) + "hr " + (remainingMinutes || 0) +"min"



    return timeString

  }

  const calculateMilliseconds =(timestamp1,timestamp2)=>{

    console.log("inside calculateMins  ===> ", timestamp1,timestamp2);

    // Convert Unix timestamps to milliseconds
    let date1 = new Date(timestamp1 );
    let date2 = new Date(timestamp2 );

    // Calculate the difference in minutes
    let diffMil = date2 - date1

    console.log("diffMil ===> ", diffMil);
    return diffMil


  }


  const calculateTimeDiff=(durationInMilliseconds)=>{





    const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    const formattedTime = `${hours}hr ${minutes}min`;
    return formattedTime


  }



  return ( 

    currentMonthData || showOption
        ?<View style={{height:"100%",flex:1,backgroundColor:"#FFF"}}>


                                        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",marginTop:40,padding:20}}>

                                            <TouchableOpacity style={{flexDirection:"row",alignItems:"flex-start",marginLeft:-10}} 
                                            
                                            onPress={()=> props?.navigation?.goBack()}
                                            
                                            
                                            >
                    
                                                <Ionicons name="md-chevron-back-outline" size={32} color="black" />
                                                <Text style={{fontSize:30,fontFamily:"UberMoveBold",color:"#000",marginRight:10,marginTop:-2}}>{userData?.name}</Text>

                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={()=>{refRBSheetBuy.current.open() } }

                                            
                                            style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"#EEE",padding:15,paddingVertical:10,borderRadius:18,marginTop:-2}}>

                                                <Text style={{fontSize:16,fontFamily:"UberMoveBold",color:"#000"}}>{currentMonthString}</Text>


                                            </TouchableOpacity>

                                        </View>

                                        <ScrollView>


                                        { timeConverter(userData?.last_scanned_at)

                                        ? <>
                                        
                                        <View style={{backgroundColor:"#EEE",padding:5,paddingHorizontal:10,marginTop:0}}>
                                                <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",textAlign:"left",marginLeft:10}}>Timestamp</Text>
                                        </View>

                                        <View style={{padding:20,paddingTop:0,flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:20}}>

                                                <View style={{flexDirection:"column",alignItems:"flex-start"}}>

                                                <TouchableOpacity
                                                onPress={()=>{props?.navigation?.navigate("ViewProfile",{uid : propsUID,profileUID : propsProfileUID, comingFrom :props?.route?.params?.comingFrom})} }
                                                    style={{backgroundColor:"#FFF",height:windowWidth/6,borderWidth:0.5,borderRadius:18,borderColor:"#000",paddingHorizontal:15,justifyContent:"center"}}>
                                                
                                                    <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",textAlign:"center"}}>{timeConverter(userData?.last_scanned_at)}</Text>
                                                    
                                                    {/* {
                                                        startTime && userData?.active_session_id && latestTime
                                                            ?<TimerScreen  timestamp={latestTime} totalTime={totalTime} comingFrom={"GlanceScreen"}/>
                                                            :startTime && !userData?.active_session_id && totalTime
                                                                ?<Text style={{fontSize: Platform.OS == "ios"? 20 :18,fontFamily:"UberMoveRegular",color:"#000",textAlign:"center"}}>{calculateTimeDiff(totalTime)}</Text>
                                                                :showTimer 
                                                                    ?<Text style={{fontSize:24,fontFamily:"UberMoveRegular",color:"#000",textAlign:"center"}}>0 hour</Text>
                                                                    :<ActivityIndicator/>
                                                        } */}

                                                    
                                                    </TouchableOpacity>


                                                    <View style={{flexDirection:"row",paddingTop:0,justifyContent:"flex-start",alignItems:"center",marginTop:0}}>
                                                        <Text style={{fontSize:14,fontFamily:"UberMoveRegular",color:"#000",textAlign:"center",marginTop:6}}>Last scanned at</Text>
                                                        <Text style={{fontSize:14,fontFamily:"UberMoveBold",color:"#000",textAlign:"center",marginTop:6}}> · </Text>
                                                        <Text style={{fontSize:14,fontFamily:"UberMoveBold",color:userData?.active_session_id ?"green":"red",textAlign:"center",marginTop:6,marginLeft:4}}>{userData?.active_session_id ? "Entry" : "Exit"}</Text>

                                                    </View>
                                                </View>

                                               
                                        </View>

                                        </>
                                        :null}


                                        <View style={{backgroundColor:"#EEE",padding:5,paddingHorizontal:10,marginTop:5}}>
                                                <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",textAlign:"left",marginLeft:10}}>Days</Text>
                                        </View>




                                        <View style={{flexDirection:"row",padding:20,paddingTop:0,justifyContent:"space-between",alignItems:"center",marginTop:20}}>


                                            <View style={{flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}>

                                                <TouchableOpacity
                                                onPress={()=>{props?.navigation?.navigate("ViewProfile",{uid : propsUID,profileUID : propsProfileUID, comingFrom :props?.route?.params?.comingFrom})} }
                                                 style={{backgroundColor:"#0CA92A",height:windowWidth/5,width:windowWidth/5,borderRadius:360,justifyContent:"center"}}>

                                                    <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#fff",textAlign:"center"}}>{currentMonthData?.present || 0}</Text>

                                                </TouchableOpacity>
                                                <Text style={{fontSize:14,fontFamily:"UberMoveRegular",color:"#000",textAlign:"center",marginTop:6}}>Present</Text>

                                            </View>

                                            <View style={{flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}>

                                            <TouchableOpacity
                                                onPress={()=>{props?.navigation?.navigate("ViewProfile",{uid : propsUID,profileUID : propsProfileUID, comingFrom :props?.route?.params?.comingFrom})} }

                                                style={{backgroundColor:"#C70039",height:windowWidth/5,width:windowWidth/5,borderRadius:360,justifyContent:"center"}}>

                                                    <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#FFF",textAlign:"center"}}>{currentMonthData?.absent || 0}</Text>

                                                </TouchableOpacity>
                                                <Text style={{fontSize:14,fontFamily:"UberMoveRegular",color:"#000",textAlign:"center",marginTop:6}}>Absent</Text>

                                            </View>

                                            <View style={{flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}>

                                            <TouchableOpacity
                                                onPress={()=>{props?.navigation?.navigate("ViewProfile",{uid : propsUID,profileUID : propsProfileUID, comingFrom :props?.route?.params?.comingFrom})} }
                                                
                                                
                                                style={{backgroundColor:"#FFDE14",height:windowWidth/5,width:windowWidth/5,borderRadius:360,justifyContent:"center"}}>

                                                    <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",textAlign:"center"}}>{currentMonthData?.leave || 0}</Text>

                                                </TouchableOpacity>
                                                <Text style={{fontSize:14,fontFamily:"UberMoveRegular",color:"#000",textAlign:"center",marginTop:6}}>Leaves</Text>

                                            </View>

                                            <View style={{flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}>

                                                <TouchableOpacity
                                                onPress={()=>{props?.navigation?.navigate("ViewProfile",{uid : propsUID,profileUID : propsProfileUID, comingFrom :props?.route?.params?.comingFrom})} }
                                                 style={{backgroundColor:"#0047AB",height:windowWidth/5,width:windowWidth/5,borderRadius:360,justifyContent:"center"}}>

                                                    <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#fff",textAlign:"center"}}>{currentMonthData?.overtime || 0}</Text>

                                                </TouchableOpacity>
                                                <Text style={{fontSize:14,fontFamily:"UberMoveRegular",color:"#000",textAlign:"center",marginTop:6}}>Overtime</Text>

                                            </View>



                                            
                                        

                                        </View>

                                        <View style={{backgroundColor:"#EEE",padding:5,paddingHorizontal:10,marginTop:5}}>
                                                <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",textAlign:"left",marginLeft:10}}>Average</Text>
                                        </View>

                                        

                                        <View style={{padding:20,paddingTop:0,flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:20}}>

                                                <View style={{flexDirection:"column",alignItems:"flex-start"}}>

                                                <TouchableOpacity
                                                onPress={()=>{props?.navigation?.navigate("ViewProfile",{uid : propsUID,profileUID : propsProfileUID, comingFrom :props?.route?.params?.comingFrom})} }
                                                    style={{backgroundColor:"#000",height:windowWidth/6,borderWidth:0.5,borderRadius:18,borderColor:"#000",width:windowWidth/3,justifyContent:"center"}}>

                                                        <Text style={{fontSize:22,fontFamily:"UberMoveMedium",color:"#FFF",textAlign:"center"}}>{calculateAvgTime()}</Text>

    
                                                        

                                                    
                                                    </TouchableOpacity>
                                                    <Text style={{fontSize:14,fontFamily:"UberMoveRegular",color:"#000",textAlign:"center",marginTop:6}}>Daily working</Text>

                                                </View>

                                               
                                        </View>

                                        </ScrollView>


                                        <View style={{position:"absolute",bottom:0,backgroundColor:"#FFF",paddingHorizontal:"5%",borderTopColor:"#A9A9A9",borderTopWidth:.95,paddingBottom:"4%",width:"100%",paddingTop:"1%",flexDirection:"row",justifyContent:"space-between"}}>

                                            <TouchableOpacity 
                                                            onPress={()=>{ (props?.comingFrom || props?.route?.params?.comingFrom) == "ScannerScreen" 
                                                                ?props?.navigation?.navigate("EditProfile",{profileUID : propsProfileUID, uid: propsUID, comingFrom:"ScannerScreen"}) 
                                                                : props?.navigation?.navigate("EditProfile",{profileUID : propsProfileUID, uid: propsUID}) 

                                                            } }
                                                                            style={{backgroundColor:"#EEE",paddingHorizontal:20,borderRadius:18,padding:20, width:"46%",marginTop:15,marginBottom:10,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                                                                        <Feather name="settings" size={26} color="#000" />
                                                                                    </TouchableOpacity>

                                            <TouchableOpacity 
                                                            onPress={()=>{props?.navigation?.navigate("ViewProfile",{uid : propsUID,profileUID : propsProfileUID, comingFrom :props?.route?.params?.comingFrom})} }
                                                                            style={{backgroundColor:"#000",paddingHorizontal:20,borderRadius:18,padding:20, width:"46%",marginTop:15,marginBottom:10,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                                                                <Feather name="calendar" size={26} color="white" />
                                                                                    </TouchableOpacity>

                                            
                                    
                                        </View>



                                        <RBSheet
              ref={refRBSheetBuy}
              closeOnDragDown={true}
              closeOnPressMask={true}
              animationType={"slide"}
              customStyles={{
              container:{
              padding:20,
              paddingBottom:35,
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
              ><Text style={{fontSize:30,fontFamily:"UberMoveBold",color:"#000",marginRight:10,marginBottom:20,marginTop:-20}}>Months</Text>
              <View style={{flexDirection:"row",flexWrap:"wrap",width:"100%",justifyContent:"flex-start",alignItems:"center"}}>

                                            {  everyMonth?.map((data,key)=>{


                                
                                                    return <TouchableOpacity id={key} 
                                                    style={{marginRight:10,marginVertical:10,flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"#EEE",padding:15,paddingVertical:10,borderRadius:18}}
                                                    onPress={()=>  {

                                                        getMonthData(data)

                                                    }} 

                                                    >
                                                                                                    
                                                    <Text style={{fontSize:20,fontFamily:"UberMoveRegular",color:"#000"}}>{data?.string}</Text>



                                                            </TouchableOpacity>;
                                                })}
                                                

                                                

</View>

              </RBSheet>

                                        
                                        </View> 
        // :currentMonthData == null && showOption 
        //     ? <View style={{width:"100%",height:"100%",flex:1,}}>
                
        //     <LottieView
        //         ref={animationRef}
        //         autoPlay
        //         loop={true}
        //     style={{justifyContent:"center",alignItems:"center"}}
        //         source={require("../assets/nofile.json")}
        //     />

        //     <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",marginTop:40,padding:20}}>

        //                                         <TouchableOpacity style={{flexDirection:"row",alignItems:"flex-start",marginLeft:-10}} 
                                                
        //                                         onPress={()=> props?.navigation?.goBack()}
                                                
                                                
        //                                         >
                        
        //                                             <Ionicons name="md-chevron-back-outline" size={40} color="black" />
        //                                             <Text style={{fontSize:30,fontFamily:"UberMoveRegular",color:"#000",marginRight:10,marginTop:-2}}></Text>

        //                                         </TouchableOpacity>

        //                                         <TouchableOpacity
        //                                             onPress={()=>{props?.navigation?.navigate("ViewProfile",{uid : propsUID,profileUID : propsProfileUID, comingFrom :props?.route?.params?.comingFrom})} }

                                                
        //                                         style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"#EEE",padding:15,paddingVertical:10,borderRadius:18,marginTop:-2}}>

        //                                             <Text style={{fontSize:16,fontFamily:"UberMoveBold",color:"#000"}}>{currentMonthString}</Text>


        //                                         </TouchableOpacity>

        //                                     </View>



        //     </View>
            :<View style={{backgroundColor:"#FFF",flex:1,height:"100%"}}>
                <LoadingScreen/>
                
                
            </View>
            
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1, 
    },
    map: {
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
        padding:0,
        borderColor:"#000",
        borderRadius: 6,
        marginTop: 10,
        color:"#000",
        width:"100%"

    },
    addButton:{

      
        backgroundColor: "#EEE",
        padding:5,
        borderColor:"#000",
        borderRadius: 6,
        marginTop: 0,
        color:"#000",
        width:"100%"

    },
    image: {
      resizeMode: 'center',
      
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius:18
  },

})


export default GlanceScreen