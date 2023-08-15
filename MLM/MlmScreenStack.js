import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const treeData = {
    name: 'Meet',
    referralId: 'REF123',
    treeId: '123', // Add treeId
    children: [
      {
        name: 'Bhavin',
        referralId: 'REF234',
        treeId: '234', // Add treeId
        children: [
          {
            name: 'Dinesh',
            referralId: 'REF345',
            treeId: '345', // Add treeId
            children: [
              { name: 'Hardik', referralId: 'REF456', treeId: '456' },
              { name: 'Iran', referralId: 'REF456', treeId: '456' },
            ],
          },
          { name: 'Emran', referralId: 'REF456', treeId: '456' },
        ],
      },
      {
        name: 'Chirag',
        referralId: 'REF567',
        treeId: '567', // Add treeId
        children: [
          { name: 'Faizan', referralId: 'REF678', treeId: '678' },
          {
            name: 'Vaibhav',
            referralId: 'REF789',
            treeId: '789', // Add treeId
            children: [
              { name: 'Hardik', referralId: 'REF456', treeId: '456' },
              {
                name: 'Iran',
                referralId: 'REF456',
                treeId: '456',
                children: [
                  { name: 'Jit', referralId: 'REF456', treeId: '456' },
                  { name: 'Jit', referralId: 'REF456', treeId: '456' },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  

const WebViewScreen = () => {
    const webViewRef = React.createRef();

  const [loading, setLoading] = React.useState(false)

  const postTreeData = () => {
    setLoading(true)
    console.log('first')
    webViewRef.current.injectJavaScript(`
      window.postMessage(JSON.stringify(${JSON.stringify(treeData)}), '*');
    `);
    setLoading(false)
  };

  if (loading) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator />
    </View>
      )
  }

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'http://192.168.0.102:3000' }}
      onLoad={postTreeData}
    />
  );
};

export default WebViewScreen;
