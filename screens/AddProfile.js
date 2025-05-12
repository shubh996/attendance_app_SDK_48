import React,{useEffect,useState} from 'react'
import {Card, Text, View} from 'react-native';
import { Image, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import { FontAwesome5, Ionicons,FontAwesome ,Octicons} from '@expo/vector-icons';
import { AntDesign, EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import firebase from '../firebaseConfig';
import * as ImageManipulator from 'expo-image-manipulator';




export default function AddProfile(props,navigation) {



  const images = [
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289474/people%20images/frvvdxis1tqf2lva3e8e.jpg",
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289498/people%20images/o0g1ajzwlbwegvgtmw1k.jpg",
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289556/people%20images/zcjt8sgfwidfw36wderi.jpg",
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289584/people%20images/h2mu7ozh1iayw001v9zw.jpg",
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289610/people%20images/laqp0mdv025g7i2murud.jpg",
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289626/people%20images/tughv970vaw60hut09gf.jpg",
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289648/people%20images/ew2v2hnhoj0ixtny6vou.jpg",
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289670/people%20images/qlfpixh0ammi9bw8orsm.jpg",
    "https://res.cloudinary.com/dywzucf4d/image/upload/v1690289692/people%20images/v9yx4wlihi00kmorc5ye.jpg"


  ]

  


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
  const [uploadProgress, setUploadProgress] = useState(0);



  useEffect(() => {

    if (props?.route?.params?.profileUID) firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").doc(props?.route?.params?.profileUID)
    .onSnapshot((querySnapshot) => {
        setUserData(querySnapshot?.data())
        setImage(querySnapshot?.data()?.image)
        setName(querySnapshot?.data()?.name)
        setDesignation(querySnapshot?.data()?.designation)
    })
 
    
    
}, [])


function getRandomElementFromArray(array) {
  if (array.length === 0) {
    return null; // Return null if the array is empty
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  const randomElement = array[randomIndex];
  return randomElement;
}

const createURLAndUploadData =async (a,b)=>{

    console.log(a,b)

    setFileUploading(true)
    setFile(a)
    setFileData(b)


      if (b) {

        console.log("1")
        const response = await fetch(b);
        console.log("2")
        const blob = await response.blob();
        console.log("3")
        const filename = b.substring(b.lastIndexOf('/') + 1);
        console.log("FILENAME ==> ", filename)
        const ref = firebase.storage().ref().child(`images/${filename}`);
        const uploadTask = ref.put(blob);
        uploadTask.on('state_changed', 
        
            (snapshot) => {
              console.log("scodnd  ==> ", filename)
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },

            err => {alert(err)},

            async()=>{

            }

        
        
        
        );
        try {
          console.log("4")
          await uploadTask;
          console.log("5", uploadTask)
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          console.log('Image URL:', url);
          firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").add({ "createdTimestamp" : Date.now(), name :name, image: url, designation:designation })
          .then((res)=> props?.navigation?.navigate("HomeScreen") )

        } catch (error) {
          alert('Error uploading image:', error);
        }
      }

      else{

        firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people")
        .add({ "createdTimestamp" : Date.now(), name :name, image: getRandomElementFromArray(images), designation:designation })
        .then((res)=> props?.navigation?.navigate("HomeScreen") )
      }
    
  
    // new Promise(async (res, rej) => {

    //     const response = await fetch(b);
    //     console.log("response ===> ",response)


    //     const file = await response.blob();
    //     let upload = firebase.storage().ref(`/filesPeopleImage/${props?.route?.params?.uid}/${Date.now()}${Math.random().toString(36).slice(2)}`).put(file);
  
    //     console.log("Upload ===> ",upload)
    //     upload.on( 'state_changed', snapshot => {},
    //                                           err => {
    //                                                     rej(err);
    //                                                     alert(err)
    //                                                    },
    //                                           async () => {
    //                                                     setFileUploading(false)
    //                                                     const url = await upload.snapshot.ref.getDownloadURL()
    //                                                     .then((url) => {
    //                                                         console.log("URL ---> " + url)
    //                                                         setImageURL(url)
    //                                                         setFileUploading(false)
    //                                                         firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").add({ "createdTimestamp" : Date.now(), name :name, image: url, designation:designation })
    //                                                         .then((res)=> props?.navigation?.navigate("HomeScreen") )
    //                                                     })
    //                                                     .catch(err=>{
    //                                                         alert(err);
    //                                                         setFile(null)
    //                                                         setFileUploading(false)
    //                                                     })
    //                                                 }
    //               );
    //   });


    // try {
    //   if (!image) {
    //     alert('Please pick an image first.');
    //     return;
    //   }
  
    //   const response = await fetch(image);
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch image data.');
    //   }
  
    //   const blob = await response.blob();
    //   if (!blob) {
    //     throw new Error('Failed to convert image data to Blob.');
    //   }
  
    //   const storageRef = firebase.storage().ref().child('images/' + Date.now() + '.jpg');
    //   await storageRef.put(blob);
  
    //   alert('Image uploaded successfully!');
    // } catch (error) {
    //   console.log('Error uploading image:', error.message);
    // }








}


const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.1,
    });

    console.log("result?.uri ==> " , result);

    if (!result?.canceled) {
      compressImage(result?.assets[0]?.uri);
      setNewFileName( Date.now() )
    }


    


  };


  const compressImage = async (uri) => {

    console.log("REC==>", uri)

    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Set the desired width for compression
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Adjust the compress value as needed
      );

      setImage(manipResult.uri);
    } catch (error) {
      console.log('Error compressing image:', error);
    }





  };




  const createProfile =  () => {



    if(name == "" ){
        console.log("NAME ===> ",name)
        console.log("Image ===> ",image)

      return  alert("Name & Profile Picture is required")
    }

    else{
        setUploading(true)
        createURLAndUploadData(newFileName,image)
    }

    
    
  };


  return ( 

<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
      style={{flex:1,backgroundColor:"#fff",paddingTop:40}}
    >

            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center", paddingHorizontal:5}}>

            <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,marginBottom:30, marginTop:10}}  
                onPress={()=> props?.navigation?.navigate("HomeScreen")}  >
                    <Ionicons name="md-chevron-back-outline" size={30} color="black" />
                    <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginRight:0}}>New Profile</Text>

            </TouchableOpacity>


            <TouchableOpacity onPress={()=>pickImage()} style={{marginLeft:"32%",margin:15,marginTop:0, width:50,height:50,borderRadius:360,backgroundColor:"#EEE",flexDirection:"row",justifyContent:"center",alignItems:"center"}}   >
                

                  { image
                  
                          ?<Image
                                                              style={styles.tinyLogo}
                                                              source={{uri: image,}}
                                                          />
                          :<View style={{display:"flex",justifyContent:"center",alignSelf:"center"}}>
                          <Octicons name="plus-circle" size={14} color="black" />
                          </View>

              }                   
                                            

            </TouchableOpacity>

            </View>
            

            


            <TextInput  value={name}
                                              onChangeText={e => setName( e)}
                                              placeholder="Full Name"
                                              clearable
                                              editable
                                            backgroundColor={"#EEE"}
                                            padding={30}
                                            margin={20}
                                            marginTop={20}
                                            fontSize={17}
                                            returnKeyType={"done"}
                                            borderRadius={18}
              autoCapitalize={true}
             />

<TextInput  value={designation}
                                              onChangeText={e => setDesignation( e)}
                                              placeholder="Designation"
                                              clearable
                                              editable
                                            backgroundColor={"#EEE"}
                                            padding={30}
                                            margin={20}
                                            marginTop={0}
                                            fontSize={17}
                                            returnKeyType={"done"}
                                            borderRadius={18}
              autoCapitalize={true}
             />

            {  name ?<TouchableOpacity   onPress={()=>createProfile()}   
            
              style={{marginHorizontal:"5%",width:"90%",borderRadius:18 ,flexDirection:"row",justifyContent:"center",alignItems:"center",height:70,marginVertical:10,backgroundColor:"#000",position:"absolute",bottom:20}}>
                                     


                                         {uploading
                                           ?<View style={{flexDirection:"row",fontFamily:"UberMoveLight",justifyContent:"center",alignContent:"center"}}>
                                              <ActivityIndicator  color="#FFF" size={30} ></ActivityIndicator>
                                              <Text style={{fontSize:20,fontFamily:"UberMoveMedium",color:"#fff",marginLeft:8,marginTop:2.5}}>{`${uploadProgress.toFixed(0)}%`}</Text>
                                            </View>
                                           :<View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",padding:2.5}}><Octicons name="check" size={34} color="white" /></View>
                                       } 
                                       
                               
                                </TouchableOpacity>

                                : null}
                              
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
    width: 40,
    height: 40,
    borderRadius:360,
    
  },

})

