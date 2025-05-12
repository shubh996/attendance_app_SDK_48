import React, { useRef, useState, useEffect } from 'react'
import {ScrollView, Alert, Platform ,View, Text, StatusBar, TouchableOpacity, FlatList, ImageBackground, StyleSheet } from 'react-native'
import { COLORS, SIZES } from "../constants/index"
import data from '../data/onboarding'
import { MaterialIcons,AntDesign,Feather,Ionicons,Fontisto} from '@expo/vector-icons';
import DecideScreen from './DecideScreen';
import LoginScreen from './LoginScreen';

export default function Onboarding (props) {

    const flatlistRef = useRef();
    const [currentPage, setCurrentPage] = useState(0);
    const [viewableItems, setViewableItems] = useState([])
    const [showLogin, setShowLogin] = React.useState(false);
    const [type, setType] = React.useState(false);
    const [typeName, setTypeName] = React.useState(false);
    const isiPad = Platform.OS === 'ios' && Platform.isPad;

  
  
    const selectedType =(type)=>{
     setType(type == "admin" ? true : false)
     setTypeName(type == "admin" ? "Manager" : "Staff")

     setShowLogin(true)
    }
   
   


    const handleViewableItemsChanged = useRef(({viewableItems})=> {
        setViewableItems(viewableItems)
    })
    useEffect(() => {
        if(!viewableItems[0] || currentPage === viewableItems[0].index) 
            return;
        setCurrentPage(viewableItems[0].index)

    }, [viewableItems])

    const handleNext = () => {
        if(currentPage == data.length-1)
            return;

        flatlistRef.current.scrollToIndex({
            animated: true,
            index: currentPage +1
        })
    }

    const handleBack = () => {
        if(currentPage==0) 
            return;
        flatlistRef.current.scrollToIndex({
            animated: true,
            index: currentPage - 1
        })
    }

    const handleSkipToEnd = () => {

        setShowLogin(true)

        // props?.navigation?.navigate("HomeScreen")


    }

    const renderTopSection = () => {
        return (
            <View>
                <View style={{
                    flexDirection:'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.base * 2
                }}>
                    {/* Back button */}
                    <TouchableOpacity
                     onPress={handleBack}
                     style={{
                        padding: SIZES.base
                    }}>
                        {/* Back icon */}
                        {/* Hide back button on 1st screen */}
                        <MaterialIcons name="arrow-back"  style={{
                            fontSize: 30,
                            color: COLORS.black,
                            opacity: currentPage == 0 ? 0 : 1
                        }} />
                    </TouchableOpacity>

                    {/* Skip button */}
                    {/* Hide Skip button on last screen */}
                    <TouchableOpacity style={{}} onPress={()=>handleSkipToEnd()}>
                        <Text style={{
                            fontSize: 20,
                            color: COLORS.black,
                            fontFamily:"UberMoveMedium",
                            opacity: currentPage == data.length-1 ? 0 : 1,marginRight:10
                        }}>Skip</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }

    const renderBottomSection = () => {
        return (
            <View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingHorizontal:SIZES.base *4,
                    paddingVertical: SIZES.base,
                }}>
                    {/* Pagination */}
                    <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:"center"}}>
                        {
                            // No. of dots
                            [...Array(data.length)].map((_, index)=>(
                                <View
                                key={index} 
                                style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: 5,
                                    backgroundColor: index==currentPage 
                                    ? "#000"
                                    : "#eee" ,
                                    marginRight: 8
                                }} />
                            ))
                        }
                        

                    </View>

                    {/* Next or GetStarted button */}
                    {/* Show or Hide Next button & GetStarted button by screen */}
                    {/* {
                        currentPage != data.length - 1 ? (
                            <TouchableOpacity 
                            onPress={handleNext}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: COLORS.primary
                            }}
                            activeOpacity={0.8}
                            >
                                
                                <AntDesign
                                name="arrowright"
                                style={{fontSize: 30, color: COLORS.white, marginLeft: 0}}
                                />
                            </TouchableOpacity>
                        ) : (
                            // Get Started Button
                            <TouchableOpacity 
                            
                            onPress={()=>setShowLogin(true)}

                            style={{
                                paddingHorizontal: SIZES.base ,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: COLORS.primary,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft:50
                            }}>
                                <Text style={{
                                    color: COLORS.white,
                                    fontSize: 18,
                                    marginHorizontal: SIZES.base,
                                    fontFamily:"UberMoveMedium"
                                }}>Get Started</Text>
                               
                               
                            </TouchableOpacity>
                        )
                    } */}
                    
                </View>
            </View>
        )
    }

    const renderFlatlistItem = ({item}) => {
        return (
            <View style={{
                width: SIZES.width,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom:10
            }}>
                <View style={{
                    alignItems: 'center',
                    marginVertical: SIZES.base * 2
                }}>
                    <ImageBackground
                    source={item.img}
                    style={{width: 300, height: 300, resizeMode: 'contains'}}
                    />
                </View>
                <View style={{paddingHorizontal: SIZES.base * 4, marginVertical: SIZES.base * 4}}>
                    <Text style={{opacity: 0.74,fontSize: 20, textAlign: 'center',fontFamily:"UberMoveMedium"}}>
                        {item.title}
                    </Text>
                    {/* <Text style={{
                        fontSize: 18,
                        opacity: 0.4,
                        textAlign: 'center',
                        marginTop: 15,
                        lineHeight: 28,
                        fontFamily:"UberMoveRegular"
                    }}>
                        {item.description}
                    </Text> */}
                </View>

            </View>
        )
    }

    return ( showLogin 
        
        
        ?  <View style={{
            flex: 1,
            backgroundColor: COLORS.background,
            justifyContent: 'center',
           
        }}>
      
        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:15,marginTop:70}}>
    
    <TouchableOpacity style={{flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",paddingLeft:20}}  onPress={()=> setShowLogin(false)}  >
            <Fontisto name="arrow-left" size={30} color="black" />
           
    </TouchableOpacity>
    
    {/* <Text style={{fontSize:30,fontFamily:"UberMoveBold",color:"#000",marginRight:20}}>{typeName}</Text> */}
    </View>
    <LoginScreen admin={type}/>
        </View>
    
        
        
        :
        <View style={{
            flex: 1,
            backgroundColor: COLORS.background,
            justifyContent: 'center',
           
        }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={{height:"60%",marginVertical:"10%"}}>

           
            {/* { renderTopSection() } */}

            {/* FLATLIST with pages */}
            <FlatList
            data={data}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={renderFlatlistItem}

            ref={flatlistRef}
            onViewableItemsChanged={handleViewableItemsChanged.current}
            viewabilityConfig={{viewAreaCoveragePercentThreshold: 100}}
            initialNumToRender={1}
            extraData={SIZES.width}
            />

            {/* BOTTOM SECTION - pagination & next or GetStarted button */}
            { renderBottomSection() }

            

            </View>

            <View style={{height: isiPad?"31%":"20%",marginVertical:0}}>

            
            
                              <TouchableOpacity  onPress={ ()=> selectedType("staff")} style={{width:"90%",paddingVertical:isiPad?"2%":"6%",marginHorizontal:"5%",borderRadius:18,borderWidth:0.5,backgroundColor:"#000"}}>
                                    
                                        <Text style={{color:"#FFF",fontSize:21,fontFamily:"UberMoveMedium",textAlign:"center"}}>I'm a Staff Member</Text>
                                    
                                
                              </TouchableOpacity>

                              <TouchableOpacity  onPress={ ()=> selectedType("admin")} style={{width:"90%",paddingVertical:isiPad?"2%":"6%",marginHorizontal:"5%",marginVertical:isiPad?"1%":"5%",borderRadius:18,borderWidth:0.5,backgroundColor:"#EEE",borderColor:"#EEE",marginBottom:"15%"}}>
                                    
                                        <Text style={{color:"#000",fontSize:21,fontFamily:"UberMoveMedium",textAlign:"center"}}>I'm a Manager</Text>
                                    
                                
                              </TouchableOpacity>
            
            
            
           </View>
                   
 
        </View>
    )
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