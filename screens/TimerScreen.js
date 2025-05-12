import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import moment from 'moment';




export default function TimerScreen(props){

  const [isRunning, setIsRunning] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  let timestamp = props?.timestamp; // First Unix timestamp in milliseconds
  const currentTime = moment().valueOf();
  // console.log("TIMESCREEN props?.timestamp ----> ", props?.timestamp, props?.totalTime)
  let totalTime = props?.totalTime || 0

  const [counter, setCounter] = useState('');

  useEffect(() => {
      const interval = setInterval(() => {
        const currentTime = moment(); // Current moment timestamp
        const duration = moment.duration(currentTime.diff(moment.unix(Math.floor(timestamp/1000))));

        let totalMilliseconds = Math.floor(duration.asMilliseconds()) + totalTime
        // console.log("DURATIONNNSSSS ----> ", duration, duration.hours(), Math.floor(duration.asMilliseconds()), totalMilliseconds )


        const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);

        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;


        // const hours = duration.hours();
        // const minutes = duration.minutes();
        // const seconds = duration.seconds()
        // const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;


        


      setCounter(formattedTime);


      }, 1000);
  
      return () => clearInterval(interval);
    }, []);



  useEffect(() => {

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {


    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);
    }, 1000);
    
  }, []);



  const formatTime = (milliseconds) => {


    var hours = Math.floor(milliseconds / (1000 * 60 * 60));
    var minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
};

  return (
    
    counter 
    
      ? props?.comingFrom == "GlanceScreen"
        ?<View style={{}}>
          <Text style={{fontSize: Platform.OS == "ios" ?  24 : 18,fontFamily:"UberMoveMedium",color:"#000",textAlign:"center"}}>{counter}</Text>
          </View>
        :<View style={styles.container}>
                  <Text style={styles.timerScan}>Last scanned</Text>
                  <Text style={styles.timerCounter}>{counter}</Text>
                  <Text style={styles.timerScanBottom}>hours ago</Text>
        </View>
      :<ActivityIndicator color={"white"}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop:50
  },
  timer: {
    fontSize: 60,
    marginBottom: 20,
    color:"white",
    fontFamily:"UberMoveBold"
  },
  timerCounter: {
    fontSize: 60,
    marginVertical: 10,
    color:"white",
    fontFamily:"UberMoveMedium"
  },
  timerScan: {
    fontSize: 20,
    marginTop: 10,
    color: Platform.OS == "ios" ? "#FFF": "#A9A9A9",
    fontFamily:"UberMoveRegular"
  },
  timerScanBottom: {
    fontSize: 16,
    marginTop: -12,
    color:Platform.OS == "ios" ? "#FFF":"#A9A9A9",
    fontFamily:"UberMoveRegular"
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

