import React,{useEffect,useRef} from 'react'
import {Card, Text, View} from 'react-native';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5,Fontisto, FontAwesome ,Octicons,Ionicons} from '@expo/vector-icons';
import { AntDesign, EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';




export default function EditProfile(props,navigation) {

  const [userData, setUserData] = React.useState({});
  const [image, setImage] = React.useState("");
  const [imageURL , setImageURL] = React.useState("");
  const [name, setName] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState('');
  const [fileData, setFileData] = React.useState('');
  const [newFileName, setNewFileName] = React.useState('');
  const [fileUploading, setFileUploading] = React.useState(false);
  const [imageChanged, setImageChanged] = React.useState(false);
  const [designation, setDesignation] = React.useState("");




  useEffect(() => {

    firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID)
    .onSnapshot((querySnapshot) => {
        setUserData(querySnapshot?.data())
        setImage(querySnapshot?.data()?.image)
        setName(querySnapshot?.data()?.name)
        setDesignation(querySnapshot?.data()?.designation)
    })

 
}, [])


const createURLAndUploadData = (a,b)=>{

    console.log(a,b)

    setFileUploading(true)
    setFile(a)
    setFileData(b)
  
    new Promise(async (res, rej) => {

        const response = await fetch(b);
        console.log("response ===> ",response)


        const file = await response.blob();
        let upload = firebase.storage().ref(`/filesPeopleImage/${props?.route?.params?.uid}/${Date.now()}${Math.random().toString(36).slice(2)}`).put(file);
  
        console.log("Upload ===> ",upload)
        upload.on( 'state_changed', snapshot => {},
                                              err => {
                                                        rej(err);
                                                        alert(err)
                                                       },
                                              async () => {
                                                        setFileUploading(false)
                                                        const url = await upload.snapshot.ref.getDownloadURL()
                                                        .then((url) => {
                                                            console.log("URL ---> " + url)
                                                            setImageURL(url)
                                                            setFileUploading(false)
                                                            firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).update({ "lastEdited" : Date.now(), name :name, image: url, designation:designation })
                                                            .then((res)=> props?.navigation?.goBack() )
                                                        })
                                                        .catch(err=>{
                                                            alert(err);
                                                            setFile(null)
                                                            setFileUploading(false)
                                                        })
                                                    }
                  );
      });






}


const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log("result?.uri ==> " , result);

    if (!result?.canceled) {
      setImage(result?.uri);
      setNewFileName(result?.fileName ? result?.fileName : Date.now() )
      setImageChanged(true)
    }

  };


  const onSubmit =  () => {

    if(name == "" || image == ""){
        console.log("NAME ===> ",name)
        console.log("Image ===> ",image)

      return  alert("Name & Profile Picture is required")
    }

    else{


        setUploading(true)
        if(!imageChanged){
              firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).update({ lastEdited : Date.now(),designation:designation, name:name })
              .then((res)=> {
                console.log("NAME ===> ",name)
                props?.navigation?.goBack()
              })
        }
        else createURLAndUploadData(newFileName,image)

        
    }

    
    
  };


  const deleteProfile=()=>{


    Alert.alert('Delete Profile ?', 'Once deleted will be not be recovered', [
      {
        text: 'Delete',
        onPress: () => {
          firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID).delete().then(()=>{
            props?.navigation?.goBack()
          })
        },
      },{
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
    ]);


    

  }



  return ( 

<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{flex:1,backgroundColor:"#fff"}}
    >
    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop: Platform.OS == "ios"? 40 :40,marginBottom:20}}>

                <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",paddingLeft:20}}  
                onPress={()=> props?.navigation?.goBack()}  
                >
                        <Fontisto name="arrow-left"  size={30} color="black" />
                </TouchableOpacity>


                { props?.route?.params?.comingFrom == "ScannerScreen" 

                  ?
<TouchableOpacity onPress={()=>pickImage()} style={{margin:15, width:60,height:60,borderRadius:360,backgroundColor:"#EEE",flexDirection:"row",justifyContent:"center",alignItems:"center"}}   >
        

{ image 

        ?<Image
                                            style={styles.tinyLogo}
                                            source={{uri: image}}
                                        />
        :<View style={{display:"flex",justifyContent:"center",alignSelf:"center"}}>
        <Octicons name="plus-circle" size={24} color="black" />
        </View>

}                   
                           


</TouchableOpacity>

                

                :<TouchableOpacity style={{backgroundColor:"#FFF",margin:10,borderRadius:18,paddingRight:18}}  onPress={()=> deleteProfile()}  >
                <FontAwesome5 name="trash-alt" size={28} color="#000"  />
                </TouchableOpacity>
}
    </View>
                                    
    
    
    <TextInput
                                      value={name}
                                      onChangeText={e => setName( e)}
                                      placeholder="Full Name"
                                      clearable
                                      editable
                                    backgroundColor={"#EEE"}
                                    padding={20}
                                    margin={20}
                                    marginTop={10}
                                    fontSize={17}
                                    returnKeyType={"done"}
                                    autoCapitalize={true}
                                    borderRadius={20}
                                    />

<TextInput
                                      value={designation}
                                      onChangeText={e => setDesignation( e)}

                                      placeholder="Designation"
                                      clearable
                                    backgroundColor={"#EEE"}
                                    padding={20}
                                    margin={20}
                                    marginTop={5}
                                    fontSize={17}
                                    returnKeyType={"done"}
                                    autoCapitalize={true}
                                    borderRadius={20}
                                    />

<TextInput
                                      value={userData?.phonenumber}
                                      placeholder="Phone Number"
                                      clearable
                                      editable = {false}
                                    backgroundColor={"#EEE"}
                                    padding={20}
                                    margin={20}
                                    marginTop={5}
                                    fontSize={17}
                                    returnKeyType={"done"}
                                    autoCapitalize={true}
                                    borderRadius={20}
                                    />

{ imageChanged || name != userData?.name || designation != (userData?.designation ? userData?.designation  : "") ?
                               
                                <TouchableOpacity   onPress={()=>onSubmit()}   style={{marginHorizontal:"5%",width:"90%" ,flexDirection:"row",justifyContent:"center",alignItems:"center",height:70,marginVertical:10,backgroundColor:"#000"}}>
                                      


                                          {uploading
                                            ?<View style={{flexDirection:"row",fontFamily:"UberMoveLight",justifyContent:"center",alignContent:"center"}}><ActivityIndicator  color="#FFF" size={30} ></ActivityIndicator></View>
                                            :  <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",padding:2.5}}><Octicons name="check" size={34} color="white" /></View>
                                        } 
                                        
                                
                                 </TouchableOpacity>

                                 : null}

<TouchableOpacity 
                  onPress={()=> {
                    
                    Alert.alert('Logout?', 'you can login again anytime', [
                        {
                          text: 'Confirm',
                          onPress: () => {
                            firebase.auth().signOut()
                        },
                        },{
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel"
                        },
                      ])
                    
                  
                  } } 
                  style={{position:"absolute",bottom:25,width:"90%",backgroundColor:"#000",padding:20,paddingHorizontal:17,borderRadius:20,color:"#FFF",marginLeft:20,fontSize:20,margin:15,flexDirection:"row",justifyContent:"center",alignItems:"center",}}>
                  <Text style={{fontSize:25,fontFamily:"UberMoveRegular",color:"#fff",}}>Logout</Text>
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
    width: 50,
    height: 50,
    borderRadius:360,
    
  },

})

