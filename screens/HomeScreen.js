import React,{useEffect,useRef, useState} from 'react'
import {Card, Text, View} from 'react-native';
import { AntDesign, Feather, Fontisto } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import LottieView from 'lottie-react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { Entypo,Octicons } from '@expo/vector-icons';
import LoadingScreen from './LoadingScreen';
import TimerScreen from './TimerScreen';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const isiPad = Platform.OS === 'ios' && Platform.isPad;

const HomeScreen = (props,navigation) =>{


  const [peopleData, setPeopleData] = React.useState([]);
  const [imageLoading, setImageLoading] = React.useState(false);
  const animationRef = React.useRef();
  const [currentPeopleData, setCurrentPeopleData] = React.useState([]);




  useEffect(() => {
    animationRef.current?.play()
  }, [])


  useEffect(() => {

    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").orderBy("last_scanned_at","desc").onSnapshot((querySnapshot) => {
    
      var data = []

      querySnapshot.forEach((documentSnapshot) => {
            data.push({
                uid : documentSnapshot?.id,
                ...documentSnapshot?.data()
                })

            
        })

      setPeopleData(data)


    })


    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").onSnapshot((querySnapshot) => {
    
      var data = []

      querySnapshot.forEach((documentSnapshot) => {
            
        documentSnapshot?.data().last_scanned_at ? null
        
        :data.push({
                uid : documentSnapshot?.id,
                ...documentSnapshot?.data()
                })



            
        })

      setCurrentPeopleData(data)


    })


    



  

  }, [props?.route?.params?.uid]);








  const getAttData =(data)=>{


  
      firebase.firestore().collection('att_users').doc(props?.route?.params?.uid).collection("people").doc(data?.uid)
      .onSnapshot(querySnapshot => {
            
            console.log("Going to Glance from home")
            props?.navigation?.navigate("GlanceScreen",{profileUID : data?.uid, uid:props?.route?.params?.uid, comingFrom : "HomeScreen"}) 

          })
          
  
  }

 

 

  return ( 

    <View style={{backgroundColor:"#FFF",flex:1,height:"100%"}}>

                                {/* <MapView
                                                            style={[styles.map,{alignItems:"stretch"}]}
                                                            provider={ Platform?.OS == "ios"? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
                                                            region={{latitude : userData?.latitude || 23.0254451, longitude : userData?.longitude  || 79.2030368,latitudeDelta: 0.0043,
                                                            longitudeDelta: 0.0034}}
                                                        >
                                                            <Marker coordinate={{latitude : userData?.latitude  || 0, longitude : userData?.longitude  || 0,latitudeDelta: 0.0043,
                                                            longitudeDelta: 0.0034}} 
                                                            title='Office' pinColor='red' draggable style={{width:200,height:200}} >
                                                            </Marker>
                                </MapView> */}

                                <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",width:"100%",alignItems:"flex-start",margin:10,marginTop:65}}>

                                                        <Text style={{fontSize:40,fontFamily:"UberMoveMedium",color:"#000",marginLeft:10}}>Members</Text>
                                                        
                                                        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                                                        
                                                        <TouchableOpacity style={{marginRight:10}} 
                                                        onPress={()=> 
                                                          
                                                          peopleData?.length ==0 && currentPeopleData?.length == 0 
                                                          ?props?.navigation?.navigate("AddProfile") 
                                                          :props?.navigation?.navigate("SearchPeople",{data:peopleData.concat(currentPeopleData)})
                                                        
                                                        }  ><View style={styles.addButton} >
                                                                <View style={{display:"flex",justifyContent:"center",alignSelf:"center",margin:12 }}>
                                                                    <Fontisto name={peopleData?.length ==0 && currentPeopleData?.length == 0  ? "plus-a" : "search"} size={Platform.OS === "android" ? 20:24} color={ "#000"} /></View>
                                                                </View>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{marginRight:25}} onPress={()=> props?.navigation?.navigate("SettingScreen")}  ><View style={styles.addButton} >
                                                                <View style={{display:"flex",justifyContent:"center",alignSelf:"center",margin:12 }}><Fontisto name="qrcode"  size={Platform.OS === "android" ? 20:24} color={ "#000"} /></View>
                                                                </View>
                                                            </TouchableOpacity>

                                                        </View>
                                                    

                                </View>

                                {/* <TextInput
                                    style={{ height: 40,fontSize:23,position:"absolute",bottom:0,width:"100%", backgroundColor: '#000', borderWidth: 0, margin: 0, padding: 15,paddingVertical:40, borderRadius:18 }}
                                    placeholder="Search names..."
                                    placeholderTextColor={"#A9A9A9"}
                                    onChangeText={handleSearch}
                                    value={searchQuery}
                                  /> */}

                  
                                <ScrollView style={{marginBottom:0}}>
                                
                                    {peopleData.length != 0 || currentPeopleData.length != 0 
                                
                                        ?<View style={{flexDirection:"row",padding:10,paddingBottom:50,marginTop:5,flexWrap:"wrap",width:"100%",justifyContent:"flex-start",alignItems:"center"}}>
                                                <TouchableOpacity style={{margin:5,marginTop:15}}
                                                    onPress={()=> props?.navigation?.navigate("AddProfile",{uid : props?.route?.params?.uid}) } 

                                                    >
                                                                                                    
                                                                    <View style={{borderWidth:1, height:isiPad ? windowWidth/10: windowWidth/6.8,width:isiPad ? windowWidth/10: windowWidth/6.8,justifyContent:"center",alignItems:"center",
                                                                    backgroundColor:"#EEE",borderRadius:18, borderColor :   "#FFF"}}>
                                                                     <Feather name="plus" size={25} color={ "#000"} />

                                                                        
                                                                    
                                                                    </View>


                                                                    <View style={{marginTop:10,flexDirection:"row",justifyContent:"center",alignSelf:"center",backgroundColor:"#EEE",width:isiPad ? windowWidth/12: windowWidth/7.5,padding:5,paddingHorizontal:10,borderRadius:360}}>
                                                                        <Text numberOfLines={1} style={{color: "black",fontFamily:"UberMoveMedium",fontSize:Platform.OS == "ios"? 12 : 9, }} >New</Text>
                                                                    </View>


                                                            </TouchableOpacity>

                                            {  peopleData?.map((data,key)=>{


                                
                                                    return <TouchableOpacity id={key} style={{margin:5,marginTop:15}}
                                                    // onPress={()=> props?.navigation?.navigate("ViewProfile",{profileUID : data?.uid})  } 
                                                    onPress={()=> getAttData(data) } 

                                                    >
                                                                                                    
                                                                    <View style={{borderWidth:1, width:isiPad ? windowWidth/10: windowWidth/7,
                                                                    backgroundColor:"#EEE",borderRadius:360, borderColor :   "#FFF"}}>
                                                                     <Image
                                                                        style={ styles.tinyLogo }
                                                                        source={{ uri: data?.image}}
                                                                        onLoadStart={()=>setImageLoading(true)}
                                                                        onLoadEnd={()=>setImageLoading(false)}
                                                                        progressiveRenderingEnabled={true}
                                                                        resizeMode='cover'
                                                                    />
                                                                    

                                                                        
                                                                    
                                                                    </View>


                                                                    <View style={{marginTop:10,flexDirection:"row",justifyContent:"center",alignSelf:"center",backgroundColor:data?.active_session_id ? "green" : "#EEE",width: isiPad ? windowWidth/12: windowWidth/7.5,padding:5,paddingHorizontal:10,borderRadius:360}}>
                                                                        <Text style={{color:data?.active_session_id ? "white" : "black",fontFamily:data?.active_session_id ? "UberMoveRegular" :"UberMoveMedium",fontSize: Platform.OS == "ios"? 12 : 9,}} numberOfLines={1} >{ ((data?.name)?.split(" ")[0].length > 8) ? (((data?.name?.split(" ")[0]).substring(0,7)) + '...') : data?.name?.split(" ")[0] }</Text>
                                                                    </View>


                                                            </TouchableOpacity>;
                                                })}

                                            {  currentPeopleData?.map((data,key)=>{


                                
                                                    return <TouchableOpacity id={key} style={{margin:5,marginTop:15}}
                                                    // onPress={()=> props?.navigation?.navigate("ViewProfile",{profileUID : data?.uid})  } 
                                                    onPress={()=> getAttData(data) } 

                                                    >
                                                                                                    
                                                                    <View style={{borderWidth:1, width:isiPad ? windowWidth/10: windowWidth/7,
                                                                    backgroundColor:"#EEE",borderRadius:360, borderColor :   "#FFF"}}>
                                                                     <Image
                                                                        style={ styles.tinyLogo }
                                                                        source={{ uri: data?.image}}
                                                                        onLoadStart={()=>setImageLoading(true)}
                                                                        onLoadEnd={()=>setImageLoading(false)}
                                                                        progressiveRenderingEnabled={true}
                                                                        resizeMode='cover'
                                                                    />
                                                                    

                                                                        
                                                                    
                                                                    </View>


                                                                    <View style={{marginTop:10,flexDirection:"row",justifyContent:"center",alignSelf:"center",backgroundColor:data?.active_session_id ? "green" : "#EEE",width: isiPad ? windowWidth/12: windowWidth/7.5,padding:5,paddingHorizontal:10,borderRadius:360}}>
                                                                        <Text style={{color:data?.active_session_id ? "white" : "black",fontFamily:data?.active_session_id ? "UberMoveRegular" :"UberMoveMedium",fontSize: Platform.OS == "ios"? 12 : 9,}} numberOfLines={1} >{ ((data?.name)?.split(" ")[0].length > 8) ? (((data?.name?.split(" ")[0]).substring(0,7)) + '...') : data?.name?.split(" ")[0] }</Text>
                                                                    </View>


                                                            </TouchableOpacity>;
                                                })}
                                                    
                                        </View>

                                        :<View style={{backgroundColor:"#FFF",flex:1,height:"100%"}}><LoadingScreen/></View>
                                        
                                    }

                                              


                </ScrollView>  

                <View style={{position:"absolute",bottom:30,left:ScreenWidth/2.7,backgroundColor:"#000",borderRadius:360,height:35,width:"25%",justifyContent:"center",
              shadowOffset:{width:8,height:6.6},shadowColor:"#000",shadowOpacity:0.41,elevation: 15,
              }}>
                                                          <Text style={{color:"#EEE",fontFamily: "UberMoveBold",fontSize:  15,textAlign:"center"}} >Count: {peopleData?.length + currentPeopleData?.length}</Text>

                                                                    </View>
        
        </View>

            
   
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1, 
    },
    map: {
        width:windowWidth,
        height:windowHeight/3
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
        borderRadius: 20,
        marginTop: 0,
        color:"#000",
        width:"100%"

    },
    image: {
      resizeMode: 'center',
      
  },
  tinyLogo: {
    width: isiPad ? windowWidth/10: windowWidth/7,
    height: isiPad ? windowWidth/10: windowWidth/7,
    borderRadius:360,
    resizeMode:"cover"
  },
  tinyLogoOnline: {
    width: 60,
    height: 50,
    borderRadius:9
  },

})


export default HomeScreen