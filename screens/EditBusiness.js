import React,{useEffect,useRef} from 'react'
import {Card, Text, View} from 'react-native';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5, Ionicons,FontAwesome ,Octicons} from '@expo/vector-icons';
import { AntDesign,Fontisto, EvilIcons, MaterialCommunityIcons , Feather} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import firebase from '../firebaseConfig';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';




export default function EditBusiness(props,navigation) {

  


  const [userData, setUserData] = React.useState({});
  const [image, setImage] = React.useState("");
  const [imageURL , setImageURL] = React.useState("");
  const [name, setName] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState('');
  const [fileData, setFileData] = React.useState('');
  const [newFileName, setNewFileName] = React.useState('');
  const [fileUploading, setFileUploading] = React.useState(false);
  const [longitude, setLongitude] = React.useState(null);
  const [latitude, setLatitude] = React.useState(null);
 

  useEffect(() => {

    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).onSnapshot((querySnapshot) => {
        setUserData(querySnapshot?.data())
    })
 
}, [])


const start = ()=>{

  alert("Paid Customer")

  firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).update({ paid:true, datePaid: Date.now(), stage:"done", subType:"monthly" })

}


const stop = ()=>{

  alert("Services Stopped")


  firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).update({ paid:false, datePaid: Date.now(), stage:"done", subType:"monthly" })

}




  return ( 

<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{flex:1,backgroundColor:"#fff",paddingTop:50}}
    >


            <View style={{flexDirection:"row",marginRight:20,marginTop:20,justifyContent:"space-between",alignItems:"center",paddingTop: 0,marginBottom:0}}>

                            <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",paddingLeft:15,paddingTop:0}}  
                            onPress={()=> props?.navigation?.goBack()}  
                            >
                                    <Fontisto name="arrow-left" size={30} color="#000" />
                            </TouchableOpacity>

                            {userData?.paid 
                                    ?<TouchableOpacity onPress={()=>stop()}>
                                      <Ionicons name="ios-checkbox" size={40} color="black" />
                                      </TouchableOpacity>
                                    :<TouchableOpacity onPress={()=>start()}>
                                    <Fontisto name="checkbox-passive" size={35} color="black" />
                                    </TouchableOpacity>
                                  }

                </View>

                

                <GooglePlacesAutocomplete

                          placeholder='Enter Location'
                          fetchDetails={true}
                          value={name}
                          onPress={(data, details = null) => {
                            console.log("DETAILS===> ", details?.geometry?.location);
                            setLatitude(details?.geometry?.location?.lat)
                            setLongitude(details?.geometry?.location?.lng)
                            setName( data.description)

                          }}
                          listViewDisplayed={false}
                          enablePoweredByContainer={false}
                          query={{
                            key: 'AIzaSyDtVpAhDQW3so0JBOAhdsWlt6EFWT93RNM',
                            
                            language: 'en',
                          }}

                          styles={{
                            textInputContainer: {
                              backgroundColor: '#EEE',
                              margin:20,
                              marginTop:50
                            },
                            textInput: {
                              height: 60,
                              color: '#000',
                              fontSize: 17,
                              backgroundColor: '#EEE',
                            },
                          }}
                          />


<TouchableOpacity 

    onPress={()=>{ 
      
      firebase.firestore().collection("att_users").doc(userData?.uid).update({name: name, latitude:latitude, longitude:longitude}).then(()=>{props?.navigation?.goBack()})
  
  
    } }  
    style={{position:"absolute",bottom:25,padding:12.5,width:"90%",margin:"5%",borderRadius:18,backgroundColor:"#000",height:70,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
      <FontAwesome5 name="check" size={30} color="white" />
  </TouchableOpacity>


   
                              
</KeyboardAvoidingView>

            
   
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

