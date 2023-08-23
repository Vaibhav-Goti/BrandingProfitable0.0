import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const WebViewScreen = (props) => {
  const { isLeft, isRight, treeData } = props;
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(loaderTimeout);
  }, []);

  const handleLoad = () => {
    postTreeData();
  };
  
  const filterTreeData = (data) => {
    if (data && data.children) {
      if (isLeft) {
        data.children = data.children.filter(child => child.side !== 'right');
      }

      if (isRight) {
        data.children = data.children.filter(child => child.side !== 'left');
      }
    }

    return data;
  };

  const postTreeData = () => {
    if (treeData) { 
      const dataToSend = filterTreeData({ ...treeData }); 
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
        window.postMessage(JSON.stringify(${JSON.stringify(dataToSend)}), '*');
        `);
      }
    }
  };

  useEffect(() => {
    postTreeData();
  }, [isLeft, isRight]);

  const countUsers = (node) => {
    if (!node) {
      return 0;
    }

    let count = 1; // Count the current user

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        count += countUsers(child); // Recursively count users in children
      }
    }

    return count;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </View>
    );
  }

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://sparrowsofttech.in/dev/bt' }}
      onLoad={handleLoad}
    />
  );
};

export default WebViewScreen;
