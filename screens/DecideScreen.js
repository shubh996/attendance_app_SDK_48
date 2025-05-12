import React,{useEffect,useRef} from 'react'
import {Card, Text, View, TextField} from 'react-native';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { Ionicons,Feather,MaterialIcons } from '@expo/vector-icons';
import LoginScreen from './LoginScreen';
import { StatusBar } from 'expo-status-bar';


export default function DecideScreen(props,navigation) {

  const [showLogin, setShowLogin] = React.useState(false);
  const [type, setType] = React.useState(false);



  const selectedType =(type)=>{
    Alert.alert(`Your Selected Type`, `${type}`, [
      {
        text: 'Confirm',
        onPress: () => ( setType(type == "admin" ? true : false),setShowLogin(true))
      },{
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
    ]);
  }
 

 
    
  return (


    showLogin?
    <>
    <StatusBar backgroundColor='#000' style={'dark'}/>
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:15,marginTop:50}}>

<TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",marginLeft:10}}  onPress={()=> setShowLogin(false)}  >
        <Ionicons name="md-chevron-back-outline" size={34} color="black" />
       
</TouchableOpacity>

<Text style={{fontSize:30,fontFamily:"UberMoveBold",color:"#000",marginRight:20}}>Login</Text>
</View>
<LoginScreen admin={type}/>
    </>

    

    :<View style={{backgroundColor:"#FFF",height:"100%"}}>

                <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",width:"100%",alignItems:"flex-start",margin:10,marginBottom:50,marginTop:20}}>

                    <Text style={{fontSize:40,fontFamily:"UberMoveMedium",color:"#000",marginLeft:10}}>Get Started</Text>

                    <TouchableOpacity style={{marginRight:40}}  ><View style={styles.addButton} >
                          <View style={{display:"flex",justifyContent:"center",alignSelf:"center",marginTop:3}}><MaterialIcons name="qr-code-2" size={40} color={ "#000"} /></View>
                      </View>

                      </TouchableOpacity>


                </View>

<ScrollView>
                


                  <TouchableOpacity  onPress={ ()=> selectedType("staff")} style={{marginTop:0,padding:15.5,width:"90%",margin:"5%",borderRadius:18,borderWidth:0.5,backgroundColor:"#FFF"}}>
                        
                        <View style={{flexDirection:"row",alignItems:"baseline"}}>
                            <Text style={{color:"#000",fontSize:35,fontFamily:"UberMoveMedium",marginLeft:5}}>Staff</Text>
                        </View>
                        <Text style={{color:"#000",fontSize:15,fontFamily:"UberMoveRegular",marginLeft:5,marginTop:10,marginBottom:50}}>When you login as staff for the business, you get to upload your attendance using QR code scan</Text>


                                      

                        <View   style={{padding:12.5,width:"100%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center",marginTop:10,marginBottom:-5}}>
                                <Feather name="arrow-right" size={40} color="white" />
                          </View>
                    
                  </TouchableOpacity>


                  <TouchableOpacity onPress={ ()=> selectedType("admin")}  style={{marginTop:20,padding:15.5,width:"90%",margin:"5%",borderRadius:18,borderWidth:0.5,backgroundColor:"#FFF",marginBottom:20}}>
                        
                        <View style={{flexDirection:"row",alignItems:"baseline"}}>
                            <Text style={{color:"#000",fontSize:35,fontFamily:"UberMoveMedium",marginLeft:5}}>Admin</Text>
                        </View>
                        <Text style={{color:"#000",fontSize:15,fontFamily:"UberMoveRegular",marginLeft:5,marginTop:10,marginBottom:50}}>When you login as admin for the business, you get access to dashboard to monitor attendance of your staff</Text>


                                      

                        <View   style={{padding:12.5,width:"100%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center",marginTop:10,marginBottom:-5}}>
                                <Feather name="arrow-right" size={40} color="white" />
                          </View>

                    
                  </TouchableOpacity>


      

                  </ScrollView>
       
                

      </View>


            
   
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

