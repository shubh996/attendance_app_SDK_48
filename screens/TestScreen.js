import React from 'react';
import { View, Button, Vibration } from 'react-native';
import { Audio } from 'expo-av';

const AudioPlayer = () => {



  const handlePlayAudio = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync(require('../assets/exitmusic.mp3'), {shouldPlay: true});
      await soundObject.playAsync();
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };



  return (
    <View style={{margin:100}}>
      <Button title="Play Audio" onPress={handlePlayAudio} />
    </View>
  );
};

export default AudioPlayer;

