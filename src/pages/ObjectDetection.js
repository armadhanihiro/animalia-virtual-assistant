import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from 'react-native';
import Tts from 'react-native-tts';
 


import DocumentPicker from 'react-native-document-picker';
 
const ObjectDetection = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [predictions, setpredictions] = useState(null);
  const [visible, setvisible] = useState(false);
 
  useEffect(() => {
    Tts.setDefaultVoice('id-ID-language');
  })


  

  const uploadImage = async () => {
    if (singleFile != null) {
      const fileToUpload = singleFile[0];
      const data = new FormData();
      data.append('name', 'Image Upload');
      data.append('file_list', fileToUpload);
      let res = await fetch(
        // object-to-img
        'https://e44a-114-4-219-181.ap.ngrok.io/detect/',
        {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      let responseJson = await res.json();
      setpredictions(responseJson);
      setvisible(true)
      if (responseJson.status == 1) {
        alert('Upload Successful');
      }
    } else {
      alert('Please Select File first');
    }
  };
 
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('res : ' + JSON.stringify(res));
      setSingleFile(res);
    } catch (err) {
      setSingleFile(null);
      if (DocumentPicker.isCancel(err)) {
        alert('Canceled');
      } else {
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const onSpeak = (textSpeak) => {
    // id-ID-language=> 
    Tts.voices().then((voices) => console.log(voices));
    Tts.getInitStatus().then(() => {
      Tts.speak(textSpeak, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    });
  }

  const onpressx = () => {
    setvisible(false);
    Tts.stop();
  }
  return (
    <View style={styles.mainBody}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 30, textAlign: 'center', color:'black' }}>
          AVA YOLOv5 Object Detection
        </Text>
        <Text
          style={{
            fontSize: 25,
            marginTop: 20,
            marginBottom: 30,
            textAlign: 'center',
            color:'black'
          }}>
          Online Version
        </Text>
      </View>
      <ModalPoup visible={visible}>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => onpressx()}>
                  <Image
                    source={require('../../assets/x.png')}
                    style={{ height: 30, width: 30 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              {predictions != null ? (
                <TouchableOpacity onPress={() => onSpeak("Gambar Ini Terdeteksi sebagai" + predictions[0][0].class_name + "dengan confidence" + (predictions[0][0].confidence*100).toFixed(2) +"%")}>
                  <Image style={{ height: 280, width: 280, marginVertical: 10 }} source={{ uri: "data:image/png;base64,"+ predictions[0][predictions[0].length-1].image_base64 }} />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={{ marginVertical: 30, fontSize: 20, textAlign: 'center', justifyContent:'center',color:'black' }}>
              <DataList datalist={predictions ? predictions : null} />
            </View>
          </ModalPoup>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={selectFile}>
        <Text style={styles.buttonTextStyle}>Select File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={uploadImage}>
        <Text style={styles.buttonTextStyle}>Detect !</Text>
      </TouchableOpacity>
    </View>
  );
};
 
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  buttonStyle: {
    backgroundColor: '#112D4E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#112D4E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
 
export default ObjectDetection;



function ModalPoup({ visible, children }) {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const DataList = (datalist) => {
  var list = [];
  for (let i = 0; i < datalist.datalist[0].length-1; i++) {
    list.push(
      <Text style={{color:'black', fontSize: 20, textAlign: 'center'}}>
        {i+1 + " "}{ datalist.datalist[0][i].class_name}
        {"\n"}
        {(datalist.datalist[0][i].confidence * 100).toFixed(2)+"%"}
      </Text>
    )
  }
  return (
    <View>
      {list}
    </View>
    )
}