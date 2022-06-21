import React, {useEffect, useState} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Image, View, Text} from 'react-native'
import { Splash,Home, ObjectDetection , About, TfModel} from '../pages';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Logo(){
  return(
    <View style={{flexDirection:'row'}}>
      <Image style={{width: 50, height: 50}} source={require('../../assets/avalogo.png')} />
      <Text style={{alignSelf:'center', fontSize:20, color:'white'}}>AVA</Text>
    </View>
  )
}

function Route() {
  const [ShowSplash, SetSplash] = useState(true)

  useEffect( () => {
    setTimeout(()=>{
      SetSplash(false);
    },3000);
  }, []);
  return (
    <Stack.Navigator>
        {ShowSplash ? 
          <Stack.Screen 
            name='Splash'
            component={Splash}
            options={{
              headerShown:false
            }}
          />
        :null}
        <Stack.Screen name="Home" component={TabContainer}  options={{
          title: 'Ava',
          headerTitle: (props) => <Logo {...props} />,
          headerStyle: {
            backgroundColor: '#112D4E',
          },
          headerTintColor:'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}/>
        <Stack.Screen name="ObjectDetection" component={ObjectDetection} options={{
          title: ' ',
          headerTitle: (props) => <Logo {...props} />,
          headerStyle: {
            backgroundColor: '#112D4E',
          },
          headerTintColor:'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="ImageClassification" component={TfModel} options={{
          title: '',
          headerTitle: (props) => <Logo {...props} />,
          headerStyle: {
            backgroundColor: '#112D4E',
          },
          headerTintColor:'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="About" component={About} options={{
          title: ' ',
          headerTitle: (props) => <Logo {...props} />,
          headerStyle: {
            backgroundColor: '#112D4E',
          },
          headerTintColor:'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
    </Stack.Navigator>
  );
}

export default Route;

function TabContainer() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle: {backgroundColor:'#112D4E'},
      tabBarActiveTintColor: '#fcfcfc',
      tabBarInactiveTintColor: '#bfbdbd',
      headerShown:false
    }}>
      <Tab.Screen name='Beranda' component={Home} options={{
        tabBarIcon: ({color,size}) => (
          <Ionicons name='home-outline' color={color} size={size} />
        )
      }}
      />
      <Tab.Screen name='Tentang Kita' component={About} options={{
        tabBarIcon: ({color,size}) => (
          <Ionicons name='people-outline' color={color} size={size} />
        )
      }}
      />
    </Tab.Navigator>
  );
}