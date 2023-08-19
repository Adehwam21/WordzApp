import React, { useState, useCallback } from 'react';
import { Text, FlatList, View, TextInput, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const url = 'https://api.datamuse.com/words'; // API endpoint

const WordList = () => {
  // Setting states
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [letter, setLetter] = useState('');

  // Handling Words
  const handleGetWords = useCallback(async () => {
    // Ensuring that the input data is a single letter using Regex validation
    if (!/^[a-zA-Z]$/.test(letter)) {
      Alert.alert('Invalid Input', 'Please enter a single letter.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Making a GET request to Datamuse API
      const response = await axios.get(url, {
        params: {
          sp: `${letter}*`,
          max: 100,
        },
      });

      setWords(response.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else {
        setError("Oops! Couldn't connect to the server. Please check your internet connection or try again later.");
      }
      setIsLoading(false);
    }
  }, [letter]);

  // Optimized function to render word item gotten from the API in a separate list view. 
  const renderWordItem = useCallback(({ item, index }) => (
    <View style={[styles.itemContainer, { backgroundColor: '#f3d583' }]}>
      <Text style={styles.wordText}>{`${index + 1}. ${item.word}`}</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={{ fontSize: 55, fontWeight: 'bold', textAlign: 'center', color: '#e6aa07' }}> WordZenith📚 </Text>
        <Text style={{ fontSize: 18, fontStyle: 'italic', fontWeight: '700', textAlign: 'center', color: '#000000' }}>...enter a letter, find your words.</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a letter e.g. A, b , z..."
          value={letter}
          onChangeText={(text) => setLetter(text)}
          maxLength={1}
        />
        <TouchableOpacity onPress={handleGetWords}>
          <Ionicons name="search" size={30} color="green" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.word}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
    marginTop: 32,
    padding: 10,
  },
  banner: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'green',
    borderRadius: 10,
    padding: 10,
    paddingRight: 10, // To align the search icon to the right
  },
  input: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    fontStyle: 'italic',
  },
  itemContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'green',
    marginTop: 10,
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    color: '#e6aa07',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginVertical: 20,
  },
});

export default WordList;
