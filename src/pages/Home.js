import React, { Component } from 'react';
import Carousel from '../component/Carousel'
import { dummyData } from '../data/Data'
import { Hewan } from '../data/Hewan';
import {AvaBaner} from '../data/AvaBaner';
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import Ionicons from 'react-native-vector-icons/Ionicons'

const actions = [
  {
    text: "Classification TFlite",
    icon: <Ionicons name="cloud-offline-outline" color={'white'} size={20} />,
    name: "ImageClassification",
    position: 2
  },
  {
    text: "Object Detection Yolov5",
    icon: <Ionicons name="cloud-outline" color={'white'} size={20} />,
    name: "ObjectDetection",
    position: 1
  }
];

const Tombol= () => {
  return (
    <Ionicons name='rocket-outline' style={{color:'white'}} />
  )
}

export default class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      height: 100,
    };
  }
  
  render() {
    
    let screenHeight = Dimensions.get('window').height;
    
    return (
      <View style={styles.root}>
        <View style={{  }}>
          <ScrollView>
            <View style={styles.box1} >
            <Carousel data = {AvaBaner}/>
            </View>
            <View style={styles.baner} >
                <Carousel data = {dummyData}/>
            </View>
            <View style={styles.baner} >
                <Carousel data = {Hewan}/>
            </View>
          </ScrollView>
        </View>
        <FloatingAction
        color='#112D4E'
        floatingIcon={<Ionicons name="rocket-outline" color={"white"} size={30}  />}
        actions={actions}
        onPressItem={name => {
          this.props.navigation.navigate(name)
        }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  box1:{
    height: '30%'
  },
  baner: {
    height: '30%'
  }
});
