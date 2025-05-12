
import { WebView } from 'react-native-webview';
import React,{useEffect,useRef} from 'react'
import {Card, Text, View,Switch, Badge, TextField, TouchableWithoutFeedback} from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image,Dimensions ,StyleSheet,PixelRatio,Platform,KeyboardAvoidingView,ScrollView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5,Ionicons , MaterialCommunityIcons} from '@expo/vector-icons';
import { AntDesign,Fontisto } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';



export default function QuestionScreen(props) {


    const [questions, setQuestions] = React.useState([]);
    const [ansMsg, setAnsMsg] = React.useState("");
    const [currentUID, setCurrentUID] = React.useState("");
    const [currentData, setCurrentData] = React.useState({});

    const [showDemoRequest, setShowDemoRequest] = React.useState(false);
    const [days, setDays] = React.useState(0);
    const [questionSent, setQuestionSent] = React.useState(false);
    const [answerSent, setAnswerSent] = React.useState(false);
    const [currentName, setCurrentName]= React.useState(props?.route?.params?.uid == "k8kPP10kj6aDg1ChQnETzH1oArf1" ? "shubh" : "priya")




    useEffect( () => {

        firebase.firestore().collection("question").orderBy("timestamp","desc").onSnapshot((documentSnapshot)=>{

            var tempQuestions = []



            documentSnapshot.forEach(querySnapshot=>{

                console.log("querySnapshot ==> ", querySnapshot?.data()?.question)

                tempQuestions.push({id: querySnapshot?.id, ...querySnapshot?.data()})

            })

            setQuestions(tempQuestions)
        })
      
    }, [])






  return (
<View >

{/* <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingTop: 50,marginBottom:0}}>

                            <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",paddingLeft:10}}  
                            onPress={()=> props?.navigation?.goBack()}  
                            >
                                    <Fontisto name="arrow-left" size={30} color="#000" />
                            </TouchableOpacity>

                </View> */}


                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",marginTop:40,padding:20}}>

                                            <TouchableOpacity style={{flexDirection:"row",alignItems:"flex-start",marginLeft:-10}} 
                                            
                                            onPress={()=> props?.navigation?.goBack()}
                                            
                                            
                                            >
                    
                                                <Ionicons name="md-chevron-back-outline" size={32} color="black" />
                                                <Text style={{fontSize:30,fontFamily:"UberMoveBold",color:"#000",marginRight:10,marginTop:-2}}>Questions</Text>

                                            </TouchableOpacity>

                                            <TouchableOpacity

                                            onPress={()=> props?.navigation?.navigate?.("GameScreen")}
                                            style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center",backgroundColor:"#EEE",padding:15,paddingVertical:10,borderRadius:180,marginTop:-10}}>

                                                <Text style={{fontSize:35,paddingHorizontal:10,fontFamily:"UberMoveBold",color:"#000"}}>+</Text>


                                            </TouchableOpacity>

                                        </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      
                


                {questions

                    ?questions?.map((data,key)=>{
                                
                        return <TouchableOpacity id={key} style={{margin:5,marginTop:15}}
                                    onPress={()=> props?.navigation?.navigate("GameScreen",{currentUID : data?.id})  } 
                                    >
                                                                        
                                        <View style={{borderWidth:0,padding:15,marginLeft:"4%", width: "90%",backgroundColor: data?.shubh && data?.priya ?   "#EEE" : "#000",borderRadius:18, }}>
                                         
                                        
                                        <Text style={{color:data?.shubh && data?.priya ? "#000" : "#FFF",fontFamily:"UberMoveMedium",fontSize: 18,}} numberOfLines={3} >{ data?.question }</Text>

                                            
                                        
                                        </View>


                                        


                                </TouchableOpacity>;
                    })

                    :<View style={{justifyContent:"center",alignItems:"center"}}>

                            <ActivityIndicator/>

                    </View>

                    }


                    </ScrollView>



          
    </View>
    
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#FFF",
   
    },
    scrollContainer: {
     
      padding: 0,
      marginTop:0,
      paddingBottom:160
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