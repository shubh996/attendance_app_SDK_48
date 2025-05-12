import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Simulated initial messages
  useEffect(() => {
    setMessages([
      { id: '1', sender: 'John', content: 'Hello!', timestamp: '12:00 PM' },
      { id: '2', sender: 'Jane', content: 'Hi John!', timestamp: '12:01 PM' },
    ]);
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() === '') {
      return;
    }

    const newMessage = {
      id: messages.length + 1,
      sender: 'John',
      content: inputMessage.trim(),
      timestamp: getCurrentTime(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.sender}>{item.sender}</Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          value={inputMessage}
          onChangeText={(text) => setInputMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    marginBottom: 8,
  },
  sender: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  content: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform?.OS == "ios"? 20:2
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
