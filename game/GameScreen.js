
import { WebView } from 'react-native-webview';
import React,{useEffect,useRef} from 'react'
import {Card, Text, View,Switch, Badge, TextField, TouchableWithoutFeedback} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image,Dimensions ,StyleSheet,PixelRatio,Platform,KeyboardAvoidingView,ScrollView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5,Ionicons , MaterialCommunityIcons} from '@expo/vector-icons';
import { AntDesign,Fontisto } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';



export default function GameScreen(props) {


    console.log("PROP S   =>  ", props)


    const [msg, setMsg] = React.useState("");
    const [ansMsg, setAnsMsg] = React.useState("");
    const [currentUID, setCurrentUID] = React.useState(props?.route?.params?.currentUID);
    const [currentData, setCurrentData] = React.useState({});

    const [showDemoRequest, setShowDemoRequest] = React.useState(false);
    const [days, setDays] = React.useState(0);
    const [questionSent, setQuestionSent] = React.useState(false);
    const [answerSent, setAnswerSent] = React.useState(false);
    const [currentName, setCurrentName]= React.useState(props?.route?.params?.uid == "k8kPP10kj6aDg1ChQnETzH1oArf1" ? "shubh" : "priya")


    useEffect( () => {
        currentUID ? firebase.firestore().collection("question").doc(currentUID).onSnapshot((doc)=>{ setCurrentData(doc?.data())}) : null
      }, [currentUID])


    const sendQuestion = () =>{
        firebase.firestore().collection("question").add({question:msg, timestamp: Date.now()}).then((res)=>{
                console.log("setCurrentUID ==> ", res?.id)
                setCurrentUID(res?.id)
        })
        setQuestionSent(true)
    }

    const sendAnswer = () =>{

        props?.route?.params?.uid == "k8kPP10kj6aDg1ChQnETzH1oArf1"

        ?   firebase.firestore().collection("question").doc(currentUID).update({
            
                    shubh:ansMsg
                
                })
        
        :firebase.firestore().collection("question").doc(currentUID).update({
            
            priya:ansMsg
        
        })
        setAnswerSent(true)

    }





  return (
<KeyboardAvoidingView >

<View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingTop: 50,marginBottom:0}}>

                            <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",paddingLeft:15,paddingTop:10}}  
                            onPress={()=> props?.navigation?.goBack()}  
                            >
                                    <Fontisto name="arrow-left" size={30} color="#000" />
                            </TouchableOpacity>

                            { answerSent || (currentData?.priya && currentData?.shubh && currentData?.question) || ( currentName == "shubh" &&  currentData?.shubh && currentData?.question) || ( currentName == "priya" &&  currentData?.priya && currentData?.question)



                                ?null
                                :<TouchableOpacity onPress={()=>questionSent || props?.route?.params?.currentUID ? sendAnswer() :sendQuestion()}
                                style={{backgroundColor:"#000",padding:15,paddingHorizontal:22,borderRadius:360,color:"#FFF",marginLeft:20,fontSize:20,margin:10,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                                <Text numberOfLines={4} style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#fff",}}>{
                                questionSent || props?.route?.params?.currentUID 
                                        ? "Send Answer" 
                                        :  "Send Question"

                                }</Text>
                                </TouchableOpacity>

                                
                            
                            }

                </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      
                { 
                
                answerSent || (currentData?.priya && currentData?.shubh && currentData?.question) || ( currentName == "shubh" &&  currentData?.shubh && currentData?.question) || ( currentName == "priya" &&  currentData?.priya && currentData?.question)
                    ?<View>

                        <Text numberOfLines={4} style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",paddingHorizontal:15,paddingVertical:25,backgroundColor:"#EEE",margin:"4%"}}>{currentData?.question}</Text>

                        <View style={{flexDirection:"row",alignItems:"flex-start",margin:10,marginTop:30}}>

                                <View style={{backgroundColor:"#000", borderRadius:360, justifyContent:"center",padding:7.5, width:40,height:40,marginTop:3}}>
                                        <Text  style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#FFF",textAlign:"center"}}>{currentName == "shubh" ? "P" : "S"}</Text>
                                </View>


                                {currentName == "shubh" 

                                    ? currentData?.priya 
                                        ?<View style={{backgroundColor:"#99ff99", borderRadius:18, borderColor:"#000",borderWidth:0, justifyContent:"center",padding:15,marginLeft:"2.5%", width:"84%"}}>
                                            <Text  style={{fontSize:22,fontFamily:"UberMoveRegular",color:"#000" }}>{currentData?.priya  }</Text>
                                        </View>
                                        :<ActivityIndicator style={{margin:10}}/>
                                        
                                    : currentData?.shubh
                                        ?<View style={{backgroundColor:"#99ff99", borderRadius:18, borderColor:"#000",borderWidth:0, justifyContent:"center",padding:15,marginLeft:"2.5%", width:"84%"}}>
                                            <Text  style={{fontSize:22,fontFamily:"UberMoveRegular",color:"#000"}}>{currentData?.shubh}</Text>
                                        </View>
                                        :<ActivityIndicator/>

                                }
                                

                        </View>

                        <View style={{flexDirection:"row",alignItems:"flex-start",margin:10,marginTop:30}}>

                                

                                <View style={{backgroundColor:"pink", borderRadius:18, borderColor:"#000",borderWidth:0 , justifyContent:"center",padding:15, width:"84%",marginLeft:"2%",}}>
                                        <Text  style={{fontSize:22,fontFamily:"UberMoveRegular",color:"#000",}}>{currentName == "shubh" ? currentData?.shubh : currentData?.priya  }</Text>
                                </View>

                                <View style={{backgroundColor:"#000", borderRadius:360, justifyContent:"center",padding:7.5, width:40,height:40,marginLeft:"2.5%",marginTop:3}}>
                                        <Text  style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#FFF",textAlign:"center"}}>{currentName == "shubh" ? "S" : "P"}</Text>
                                </View>

                        </View>
                        
                        

                    </View>
                
                
                    :questionSent || (currentData?.question  ) 
                    
                    ?<>
                    
                    {props?.route?.params?.currentUID
                    ? <Text numberOfLines={4} style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#000",paddingHorizontal:15,paddingVertical:5,backgroundColor:"#EEE",margin:"4%"}}>{currentData?.question}</Text>
                    :null

                    }


                    <TextInput
                        autoFocus
                        style={{fontSize:20,fontFamily:"UberMoveBold",height:"350%",borderRadius:9,borderColor:"pink",width:"92%",backgroundColor:"pink",marginLeft:"4%", borderWidth:0.5 , padding:15,paddingTop:20}}
                        placeholder="Type your answer"
                        onChangeText={(m)=>setAnsMsg(m)}
                        value={ansMsg}
                        multiline
                        numberOfLines={4}
                    /></>
                    
                    :<TextInput
                            autoFocus
                        style={{fontSize:20,fontFamily:"UberMoveBold", height:"350%",borderRadius:9,borderColor:"#EEE",width:"92%",backgroundColor:"#EEE",marginLeft:"4%", borderWidth:0.5 , padding:15,paddingTop:20 }}
                            placeholder="Type a question"
                            onChangeText={(m)=>setMsg(m)}
                            value={msg}
                            multiline
                        />
                        
                    }


                    </ScrollView>



          
    </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#FFF",
   
    },
    scrollContainer: {
     
      padding: 0,
      marginTop:10,
      paddingBottom:60
    },
    textInput: {
      height: 60,
      borderWidth: 0,
      borderColor: '#ccc',
      borderRadius: 4,
      paddingHorizontal: 8,
      marginBottom: 0,
      position:"absolute",
      bottom:0
    },
  });