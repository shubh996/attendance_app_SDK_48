import { WebView } from 'react-native-webview';
import React,{useEffect,useRef} from 'react'
import {Card, Text, View,Switch, TextField} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { Image ,StyleSheet,ActivityIndicator,PixelRatio,Platform,Dimensions,KeyboardAvoidingView,ScrollView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput} from 'react-native';
import { FontAwesome5,Ionicons , MaterialCommunityIcons, Entypo} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';
import { Fontisto,FontAwesome } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';

import OTPTextView from 'react-native-otp-textinput';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Share } from 'react-native';

import RBSheet from "react-native-raw-bottom-sheet";
import { SearchBar } from 'react-native-elements';
import {  StatusBar } from 'react-native-web';
import * as WebBrowser from 'expo-web-browser';
import QRCode from 'react-native-qrcode-svg';
import { NavigationContainer } from '@react-navigation/native';

export default function AdminPanel(props) {

  const refRBSheet = React.useRef();
  const refRBSheetAssign = React.useRef();

  const [search, setSearch] = React.useState('');
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);
  const [masterDataSource, setMasterDataSource] = React.useState([]);
  var hours = new Date().getHours();
  const [greeting, setGreeting] = React.useState( hours > 4 && hours <12 ?"Good Morning" : hours > 12 && hours <16 ? "Good Afternoon" : hours > 16 && hours <22 ?"Good Evening" : hours > 16 && hours <23 ?"Good Night" : hours > 0 && hours <4 ?"Good Night" :"Welcome"  );
  const [description, setDescription] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [price, setPrice] = React.useState();
  const [isValidPrice, setIsValidPrice] = React.useState(false);
  const [isVisitedPrice, setIsVisitedPrice] = React.useState(false);
  const showPriceError = !isValidPrice && isVisitedPrice && price 
  const [fileData, setFileData] = React.useState(null);
  const [currentData, setCurrentData] = React.useState("login");

  const [uploading, setUploading] = React.useState(true);
  const [fileUploading, setFileUploading] = React.useState(false);
  const [showbusiness, setShowBusiness] = React.useState(false);

  const [scrolled, setScrolled] = React.useState(0);
  const [imageSize, setImageSize] = React.useState(0);
  const [number, setNumber] = React.useState('');
  const [backgroundImage, setBackgroundImage] = React.useState(null);
  const [userData, setUserData] = React.useState({});
  let counterScrolled = 0;
  let animationContainer =React.useRef();
  const [imageLoadedHighlight, setImageLoadedHighlight]=React.useState(false);
  const [imageLoadedProductSection, setImageLoadedProductSection]=React.useState(false);
  const [checked, setChecked] = React.useState(false);
  const [showProfile, setShowProfile]=React.useState(false);

  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false);
  const [isOpenDrawerPayments, setIsOpenDrawerPayments] = React.useState(false);
  const [loginData, setLoginData] = React.useState([]);

  const [activeKey, setActiveKey] = React.useState(0);

  const [business, setBusiness] = React.useState({});
  const [features, setFeature] = React.useState([]);
  const [showProOnlyList, setShowProOnlyList] = React.useState(false);
  const [version, setVersion] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailBody, setEmailBody] = React.useState('');
  const [emailSubject, setEmailSubject] = React.useState('');
  const [instagram, setInstagram] = React.useState('');
  const [linkedin, setLinkedin] = React.useState('');

  const [userDataFromFirebase, setUserDataFromFirebase] = React.useState([]);
  const [fileName, setFileName] = React.useState('');
  const [fileExist, setFileExist] = React.useState(false);
  const [newFileURL, setNewFileURL] = React.useState('');
  const [showSocialDrawer, setShowSocialDrawer] = React.useState(false);


  const [selectedUser, setSelectedUser] = React.useState("");
  const [isActive, setIsActive] = React.useState([]);
  const [showNoti, setShowNoti] = React.useState(false);
  const [openLockDrawer, setOpenLockDrawer] = React.useState(false);
  const [showAppDrawer, setShowAppDrawer] = React.useState(false);
  const [showDrawerWebApp, setShowDrawerWebApp] = React.useState(false);
  const [passcode, setPasscode] = React.useState(["","","",""])
  const [userUID, setUserUID] = React.useState("");
  const [qrURL, setQRURL] = React.useState("");
  const [name, setName] = React.useState("");
  const [showNotiUnlock, setShowNotiUnlock] = React.useState(false);
  const [showNotiLock, setShowNotiLock] = React.useState(false);
  const [incorrectpasscord, setincorrectpasscord] = React.useState(false);
  const [loader, showLoader] = React.useState(true);
  const [current, setCurrent] = React.useState(0);
  const [userAgent, setUserAgent] = React.useState("");
  const [standalone, setStandalone] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showLockModal, setShowLockModal] = React.useState(false);
  let phoneInput = useRef(null);
  let whatsappInput = useRef(null);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0


  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
  ];


    useEffect(() => {


      setCurrentData("scan")

    firebase.firestore().collection("att_users").orderBy("last_scanned_at","desc").onSnapshot(querySnapshot => {

      let userDataFromFirebase = []
      let FilteredDataSource = []
      let MasterDataSource = []


        querySnapshot.forEach(documentSnapshot => {
          

          if(documentSnapshot?.data()?.account_type == "staff"){
            firebase.firestore().collection('att_users').doc(documentSnapshot?.data()?.business_uid).collection("people").doc(documentSnapshot?.data()?.people_uid).onSnapshot((doc)=>{

              
              userDataFromFirebase.push({officeAddress:documentSnapshot?.data()?.name,...doc?.data(), id: documentSnapshot?.data()?.people_uid, b_uid:documentSnapshot?.data()?.business_uid});
              MasterDataSource.push({officeAddress:documentSnapshot?.data()?.name,...doc?.data(), id: documentSnapshot?.data()?.people_uid, b_uid:documentSnapshot?.data()?.business_uid});
            })
            
          }
         
          
          

    })

    setUserDataFromFirebase(userDataFromFirebase)
      setMasterDataSource(MasterDataSource);

  })


    firebase.firestore().collection('users').doc("k8kPP10kj6aDg1ChQnETzH1oArf1").onSnapshot(doc => {         
        setVersion(doc?.data()?.latest_version)
    })


    // fetchLogin()


}, []);

const searchFilterFunction = (text) => {
  // Check if searched text is not blank
  if (text) {
    // Inserted text is not blank
    // Filter the masterDataSource
    // Update FilteredDataSource
    const newData = masterDataSource.filter(function (item) {
      const itemData = item?.name
        ? item?.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setUserDataFromFirebase(newData);
    setSearch(text);
  } else {
    // Inserted text is blank
    // Update FilteredDataSource with masterDataSource
    setUserDataFromFirebase(masterDataSource);
    setSearch(text);
  }
};



const convertStampDateTime = (unixtimestamp)=>{

  if(unixtimestamp == undefined ||  unixtimestamp == null ) return false

  // Months array
  var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
  
  // Convert timestamp to milliseconds
  var date = new Date(unixtimestamp);
  
  // Year
  var year = date.getFullYear();
  
  // Month
  var month = months_arr[date.getMonth()];
  
  // Day
  var day = date.getDate();
  
  // Hours
  var hours = date.getHours();
  
  // Minutes
  var minutes = date.getMinutes();
  
  // Seconds
  var seconds = "0" + date.getSeconds();
  
  
  // final date
  var convdataTime = day+' '+month+' ' +" · "+ hours + ":"+ minutes
  return convdataTime;

  }


  const fetchLoginData=(uid)=>{


    console.log("UID == > ", uid)


    firebase.firestore().collection("att_users").doc(uid?.uid || uid?.main_uid).collection("stats").doc("login_data").onSnapshot(querySnapshot=>{
      setLoginData((querySnapshot?.data()?.last_login_at).reverse())

    })

    setShowModal(true)



  }


  const showLoginData=(data)=>{
  
  
    return <TouchableOpacity style={{borderRadius:18, borderColor:"#f2f2f2",padding:5,borderWidth:0.6,margin:5}}>
        <Text style={{margin:5,color:"#ddd",fontFamily:"UberMoveRegular",fontSize:25.5}}  > {convertStampDateTime(data?.item?.timestamp)}</Text>
        </TouchableOpacity>


}


  const showusers = (data,key)=>{


    console.log("POPES ===> ", data)




                                    
      return data?.item?.last_login_at 
      ? <TouchableOpacity 

        onPress={()=>{

          //fetchLoginData(data?.item)

          currentData == "scan" 
          ? props?.navigation?.navigate("GlanceScreen",{profileUID : data?.item?.id, uid:data?.item?.b_uid}) 
          :props?.navigation?.navigate("HomeScreen",{uid:data?.item?.uid})

        }}



      onLongPress={()=> { 
       currentData == "scan"
          ?Alert.alert(`${data?.item?.phonenumber}`, `Office: ${data?.item?.officeAddress}`, [
            {
              text: 'Okay',
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },{
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
          ])
          :props?.navigation?.navigate("EditBusiness",{uid:data?.item?.uid})  } } 
      style={{flexDirection:"row",justifyContent:"space-between",alignItem:"center",padding:10,paddingHorizontal:20,borderBottomColor:"#222",borderBottomWidth:0.25,backgroundColor: "#fff"}}>

      <Text numberOfLines={2} style={{color:  "#000",fontSize:19,fontFamily:"UberMoveMedium",width:"60%"}}  >{data?.item?.name}</Text>
      <Text style={{color:"#0047AB",fontFamily:"UberMoveBold",fontSize:17.5}}  > {  convertStampDateTime(data?.item?.last_login_at)}</Text>

            </TouchableOpacity>:null

      }


   
    
    const fetchLogin =()=>{

      setCurrentData("login")

         firebase.firestore().collection("att_users").orderBy("last_login_at","desc").onSnapshot(querySnapshot => {

      let userDataFromFirebase = []
      let FilteredDataSource = []
      let MasterDataSource = []


        querySnapshot.forEach(documentSnapshot => {

          if(documentSnapshot?.data()?.account_type == "admin"){
           userDataFromFirebase.push(documentSnapshot.data());
          MasterDataSource.push(documentSnapshot.data());
          }

    })

    console.log("userDataFromFirebase2 ====> ",userDataFromFirebase[0])


    setUserDataFromFirebase(userDataFromFirebase)
      setMasterDataSource(MasterDataSource);

  })

    }


    const fetchScan =()=>{

      console.log("ISNIDE SCANNING")

      setCurrentData("scan")
      firebase.firestore().collection("att_users").orderBy("last_login_at","desc").onSnapshot(querySnapshot => {

        let userDataFromFirebase = []
        let FilteredDataSource = []
        let MasterDataSource = []
  
  
          querySnapshot.forEach(documentSnapshot => {
  
            if(documentSnapshot?.data()?.account_type == "admin"){
             userDataFromFirebase.push(documentSnapshot.data());
            MasterDataSource.push(documentSnapshot.data());
            }
  
      })
  
      console.log("userDataFromFirebase2 ====> ",userDataFromFirebase[0])
  
  
      setUserDataFromFirebase(userDataFromFirebase)
        setMasterDataSource(MasterDataSource);
  
    })


   

    }
    
  
  

  return <View style={{backgroundColor:"#fff",flex:1}}>


<TouchableOpacity onPress={()=>props?.navigation?.goBack()} style={{paddingTop:55,paddingLeft:20}}>
<Text style={{color:  "#000",fontSize:40,fontFamily:"UberMoveMedium",}}  >{`< Analytics`}</Text>
        </TouchableOpacity>


                    



<View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",margin:-10,marginTop:10,marginBottom:20}}>


        <TouchableOpacity onPress={()=>fetchScan()} style={{backgroundColor:currentData == "scan" ? "#000" : "#EEE",borderTopLeftRadius:18,borderBottomLeftRadius:18,height:50,justifyContent:"center",alignContent:"center",paddingHorizontal:"7%"}}>
          <AntDesign name="team" size={24} color={currentData == "scan" ? "#FFF" : "#000"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>fetchLogin()} style={{backgroundColor:currentData == "login" ? "#000" : "#EEE",borderBottomRightRadius:18,borderTopRightRadius:18,marginLeft:0,height:50,justifyContent:"center",paddingHorizontal:"7%"}}>
            <FontAwesome name="magic" size={24} color={currentData == "login" ? "#FFF" : "#000"} />
        </TouchableOpacity>

        

        <TextInput
                
                style={{fontSize:20,  backgroundColor: '#EEE', borderWidth: 0,borderRadius:18, height: 51, marginVertical: 15,padding:15,width:"45%",marginLeft:10 }}
                placeholder="Search here..."
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
              />

</View>

        

      <FlatList
                data={userDataFromFirebase}
                renderItem={showusers}
                keyboardShouldPersistTaps={'always'}
                numColumns={1}
              />



<Modal presentationStyle="pageSheet" animationType={"slide"} visible={showModal}>

<TouchableOpacity style={{backgroundColor:"#fff",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",width:"70%",alignItems:"flex-start",margin:10,marginBottom:15,marginTop:25}} onPress={()=> setShowModal(false)}>
                    
                    <View style={{flexDirection:"row",justifyContent:"space-evenly",marginLeft:0}}    >
                        <Ionicons name="md-chevron-back-outline" size={32} color="black" />
                    </View>
                    <Text style={{fontSize:30,fontFamily:"UberMoveMedium",color:"#000",marginRight:10,marginTop:-2}}>Login timestamp</Text>

                </TouchableOpacity>

<ScrollView style={{backgroundColor:"#000",paddingTop:50}}>
             <FlatList
                data={loginData}
                renderItem={showLoginData}
                keyboardShouldPersistTaps={'always'}
                keyExtractor={(item) => item.id}
                numColumns={1}
              />
             </ScrollView>

                

                </Modal> 





            
            </View>
            
    
   
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
});
