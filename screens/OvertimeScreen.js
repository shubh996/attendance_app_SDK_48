
import React, { useEffect, useRef,useState } from 'react';
import LottieView from 'lottie-react-native';
import {Animated, Card, Text, View} from 'react-native';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5, FontAwesome ,Octicons,Ionicons} from '@expo/vector-icons';
import { AntDesign,Feather, EvilIcons, MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Icon, Slider } from 'react-native-elements';
import firebase from '../firebaseConfig';


export default function NoInterentFound(props) {
  const animationRef = React.useRef();
  const [selected, setSelected] = useState([3]);
  const [loading, setLoading] = React.useState(false);


  const onValuesChangeFinish = (values) => {
    setSelected(values);
  };

  useEffect(() => {
    animationRef.current?.play()
  }, [])

  function dateConverterWithoutDate(dateString){

    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dateParts = dateString.split("-");
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];
    var formattedDate = month + "-" + year;
    return formattedDate;
    
  }

  const updateOvertime = () => {

      if(props?.route?.params?.isAdmin){
  
  
        setLoading(true)

        if(props?.route?.params?.overtimeUID){
            firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("attendance")
            .doc(props?.route?.params?.overtimeUID).update({overtime: selected[0], date: props?.route?.params?.currentData?.date}) 
            
            props?.navigation?.goBack()
        
        }
        else{

            firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data").where("month_year","==",dateConverterWithoutDate(props?.route?.params?.currentData?.date)).get().then((doc)=>{
                
                doc?.forEach((documentSnapshot)=>{

                    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data")
                    .doc(documentSnapshot?.id).update({overtime:(documentSnapshot?.data()?.overtime || 0) + 1})

                })

            }).then(()=>{
                firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("attendance")
                .add({overtime: selected[0], date: props?.route?.params?.currentData?.date}) 
            }).then(()=>props?.navigation?.goBack())
            
            
        }
      }
      else Alert.alert("Contact Manager")
  
    }

    const deleteOvertime = () => {
  
  
        setLoading(true)

        firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data").where("month_year","==",dateConverterWithoutDate(props?.route?.params?.currentData?.date)).get().then((doc)=>{
                
            doc?.forEach((documentSnapshot)=>{

                firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("data")
                .doc(documentSnapshot?.id).update({overtime:documentSnapshot?.data()?.overtime - 1})

            })

        }).then(()=>{
            firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).collection("attendance")
            .doc(props?.route?.params?.overtimeUID).delete()
        }).then(()=>{props?.navigation?.goBack()})

       
            
            
            
       
        

        
    
  
    }

    
  return (
        <View style={{width:"100%",height:"100%",flex:1,padding:20,backgroundColor:"#FFF"}}>
            <View

              style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:5,marginTop:Platform.OS === "ios" ? 45 : 30    }}>

                          <TouchableOpacity
                                onPress={()=>props?.navigation?.goBack() }   style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",marginLeft:-10}}  >
                                  <Ionicons name="md-chevron-back-outline" size={35} color="black" />
                                  <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginLeft:-5}}>Overtime</Text>
                          </TouchableOpacity>

                          {props?.route?.params?.overtime
                            ?<TouchableOpacity
                            onPress={()=> deleteOvertime()}>
                                <FontAwesome5 name="trash-alt" size={28} color="#C70039"  style={{marginRight:5,marginTop:-10}}/>
                                </TouchableOpacity>
                            : null
                        }

              </View>


              <View  style={{alignItems:"center",marginTop:50,backgroundColor:"#000",padding:20,borderRadius:12,shadowRadius:12,
                            shadowOffset:{width:8,height:6.6},shadowColor:"#A9A9A9",shadowOpacity:0.81,elevation: 0,}}>

                <Text style={{fontSize:40,fontFamily:"UberMoveMedium",color:"#fff",marginBottom:65}}>{selected} { selected ==1 ? "hour" : "hours"}</Text>


                <MultiSlider
                        min={1}
                        max={24}
                        allowOverlap
                        sliderLength={Dimensions.get('window').width/1.4}
                        values={selected}
                        onValuesChangeFinish={onValuesChangeFinish}
                        enableLabel={true}
                        trackStyle={{ height: 20,borderRadius: 18, }}
                        markerOffsetY={8}
                        selectedStyle={{ backgroundColor: "#fff", }}
                        unselectedStyle={{backgroundColor: "#A9A9A9", }}
                        markerStyle={{
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          
                        }}
                />
            </View>


            <TouchableOpacity onPress={()=> updateOvertime() }  style={{position:"absolute",bottom:18,padding:12.5,width:"100%",margin:"2.5%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
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
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    wrapper: {
    
    },
  });