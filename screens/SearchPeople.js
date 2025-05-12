// import React, { useStat,useEffect ,useState} from 'react';
// import firebase from '../firebaseConfig';
// import { AntDesign, Feather } from '@expo/vector-icons';
// import { View,Image, Text, Dimensions ,StyleSheet,ScrollView,PixelRatio, Switch,ImageBackground,Platform,KeyboardAvoidingView,Keyboard, FlatList,Modal, ListViewComponent, Alert, TouchableHighlight, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
// import LottieView from 'lottie-react-native';
// import RBSheet from "react-native-raw-bottom-sheet";
// import { Entypo,Octicons } from '@expo/vector-icons';
// import LoadingScreen from './LoadingScreen';
// import TimerScreen from './TimerScreen';
// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

// const SearchPeople = (props) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [names, setNames] = useState([]);
//   const [peopleData, setPeopleData] = React.useState([]);
//   const [imageLoading, setImageLoading] = React.useState(false);
//   const animationRef = React.useRef();
//   const [userData, setUserData] = React.useState([]);
//   const refRBSheetBuy = React.useRef();
//   const [currentPeopleData, setCurrentPeopleData] = React.useState({});
//   const [currentMonthData, setCurrentMonthData] = React.useState(null);
//   const [currentMonthString, setCurrentMonthString] = React.useState(null);


//   useEffect(() => {
//     animationRef.current?.play()
//   }, [])



//   const handleSearch = query => {
//     setSearchQuery(query);
//   };


//   useEffect(() => {

//     firebase.firestore().collection("att_users").doc(props?.route?.params?.uid).collection("people").onSnapshot((querySnapshot) => {
    
//       var data = []
//       var tempName = []


//       querySnapshot.forEach((documentSnapshot) => {
//             data.push({
//                 uid : documentSnapshot?.id,
//                 ...documentSnapshot?.data(),
//                 })
//             tempName.push(documentSnapshot?.data()?.name)
            
//         })

//         setNames(tempName)
//         setPeopleData(data)

//     })
// })

//   return (
//     <View style={{flex:1,backgroundColor:"#fff",height:"100%",marginTop:70}}>
//       <TextInput
//         placeholder="Search..."
//         onChangeText={handleSearch}
//         value={searchQuery}
//       />
//       <FlatList
//         data={names}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => <Text>{item}</Text>
//     }
//       />
//     </View>
//   );
// };

// export default SearchPeople;



import React, { useState } from 'react';
import { View, Image,Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Entypo,Octicons,Ionicons } from '@expo/vector-icons';

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.data = [];
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, data) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEndOfWord = true;
    node.data.push(data);
  }

  search(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char);
    }
    return node.data;
  }
}

const SearchableList = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const trie = new Trie();

  // Replace 'data' with your list of names
  const data = props?.route?.params?.data


  // Build the trie with names and corresponding data
  // data.forEach(({ name, ...rest }) => {
  //   trie.insert(name.toLowerCase(), { name, ...rest });
  // });

  const handleSearch = (text) => {


    setSearchQuery(text);
    // const results = trie.search(text.toLowerCase());
    const filteredNames = data.filter(nama =>

          nama?.name.toLowerCase().includes(text.toLowerCase())
          

      );
    text ? setFilteredData(filteredNames) : setFilteredData(data)
    console.log("ACTION ===> ", filteredNames)

  };

  const renderListItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={()=>props?.navigation?.navigate("GlanceScreen",{profileUID : item?.uid, uid:props?.route?.params?.uid, comingFrom : "HomeScreen"}) } style={{ paddingHorizontal: 20, marginTop:20,flexDirection:"row", justifyContent:"flex-start",alignItems:"center" }}>
        <Image  style={ {borderRadius:360, width:30, height:30,marginRight:10,borderWidth:0.5, borderColor:"#A9A9A9"} }  
        source={{ uri: item?.image}}
        />
        <Text style={{fontSize:20,fontFamily:"UberMoveMedium"}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor:"#FFF",height:"100%", }}>

      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",marginTop:50,padding:15}}>

          <TouchableOpacity style={{flexDirection:"row",alignItems:"flex-start",marginLeft:-10}} 

          onPress={()=> props?.navigation?.goBack()}


          >

              <Ionicons name="md-chevron-back-outline" size={38} color="black" />
              <Text style={{fontSize:35,fontFamily:"UberMoveBold",color:"#000",marginLeft:-3,marginTop:-2}}>Search</Text>

          </TouchableOpacity>

       

          </View>


      <TextInput
        autoFocus
        style={{fontSize:22,  backgroundColor: '#EEE', borderWidth: 0,borderRadius:18, height: 70, margin: 15,padding:15 }}
        placeholder="Type here..."
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
        data={filteredData.length > 0 ? filteredData : props?.route?.params?.data}
        renderItem={renderListItem}
        // keyExtractor={(item) => item.created.toString()}
      />
    </View>
  );
};

export default SearchableList;
