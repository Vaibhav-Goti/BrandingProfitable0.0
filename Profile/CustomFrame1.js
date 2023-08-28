import { Slider } from '@rneui/base';
import React, { useRef, useState, useEffect, useCallback, isValidElement } from 'react';
import { View, Text, Button, Image, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, FlatList, Animated, Dimensions, ImageBackground, StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewShot from 'react-native-view-shot';
// import Slider from 'react-native-slider'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

const { width } = Dimensions.get('window')

const staticImageUrl =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'; // Replace with your static image URL

const colors = ['black', 'red', 'blue', 'green', 'purple'];

const ImageItem = React.memo(({ id, uri, isSelected, onDelete, onSelect, width, height, rotation, top, left, scaleX, scaleY }) => {

  const [profileFound, isProfileFound] = useState(false)
  useEffect(() => {
    if (uri == 'https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60') {
      isProfileFound(true)
    }
  })
  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <View style={{ position: 'relative', top, left, transform: [{ rotate: `${rotation || 0}deg` }] }}>
        <Image
          source={{ uri }}
          style={{
            width: width * scaleX,
            height: height * scaleY,
            marginBottom: 10,
            borderColor: isSelected ? 'black' : 'transparent',
            borderWidth: isSelected ? 2 : 0,
            top: 0,
            left: 0,
            borderRadius: profileFound ? 100 : 0
          }}
        />
        {isSelected && (
          <TouchableOpacity
            onPress={onDelete}
            style={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'red', padding: 5, borderRadius: 10, width: 25, alignItems: 'center' }}
          >
            <Icon name="trash" size={17} color={"white"} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
});



const App = ({ navigation, route }) => {
  const viewShotRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isStaticImageAdded, setIsStaticImageAdded] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [selectedImageSize, setSelectedImageSize] = useState({ width: 150, height: 150 });
  const [isImageSelected, setIsImageSelected] = useState(false)

  const [textItems, setTextItems] = useState([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState(-1);
  const [isTextSelected, setIsTextSelected] = useState(false);

  const [jsonData, setJsonData] = useState(null);
  const [rotationValue, setRotationValue] = useState(0);
  const animatedRotation = new Animated.Value(rotationValue);

  const [data, setData] = useState([]);

  const [fileUri, setFileUri] = useState('https://img.freepik.com/premium-vector/white-texture-round-striped-surface-white-soft-cover_547648-928.jpg');

  const { itemId } = route.params;

  useEffect(() => {
    // Define the URL for the GET request
    const apiUrl = `https://b-p-k-2984aa492088.herokuapp.com/frame/frameimage/${itemId}`;

    // Make the GET request using Axios
    axios
      .get(apiUrl)
      .then(response => {

        console.log(response.data)
        const imageData = response.data.data.frame;
        const data = {
          data: imageData
        };
        setJsonData(data);

        console.log(imageData, "skdjfkdfjdlfkad")

      })
      .catch(error => {
        console.log('Error fetching response.data.data:', error)
      });

  }, []);

  // useEffect(() => {
  //     const jsonData = {
  //         "data": { "id": "Dd7tTcKe3i27kZeR9p7fE", "type": "GRAPHIC", "name": "Untitled Design", "frame": { "width": 300, "height": 300 }, "scenes": [{ "id": "h7rCdxFjcb2ITDJcv3Uji", "layers": [{ "id": "background", "name": "Initial Frame", "angle": 0, "stroke": null, "strokeWidth": 0, "left": 0, "top": 0, "width": 100, "height": 100, "opacity": 1, "originX": "left", "originY": "top", "scaleX": 1, "scaleY": 1, "type": "Background", "flipX": false, "flipY": false, "skewX": 0, "skewY": 0, "visible": true, "shadow": { "color": "#FCFCFC", "blur": 4, "offsetX": 0, "offsetY": 0, "affectStroke": false, "nonScaling": false }, "fill": "#FFFFFF", "metadata": {} }, { "id": "Dr-UklbO7LcsZXq-8Snyr", "name": "StaticImage", "angle": 0, "stroke": null, "strokeWidth": 0, "left": 0, "top": 42.43000000000001, "width": 32, "height": 32, "opacity": 1, "originX": "left", "originY": "top", "scaleX": 0.98, "scaleY": 0.98, "type": "StaticImage", "flipX": false, "flipY": false, "skewX": 0, "skewY": 0, "visible": true, "shadow": null, "src": "https://www.livedesimall.com/CDN/upload/107whatsapp(1).png", "cropX": 0, "cropY": 0, "metadata": {} }, { "id": "3M6slqncFwB6_Fx-MOpjj", "name": "StaticText", "angle": -0.18, "stroke": null, "strokeWidth": 0, "left": 64.01999999999998, "top": 48.72, "width": 171.9, "height": 18.25, "opacity": 1, "originX": "left", "originY": "top", "scaleX": 1, "scaleY": 1, "type": "StaticText", "flipX": false, "flipY": false, "skewX": 0, "skewY": 0, "visible": true, "shadow": null, "charSpacing": 30, "fill": "#333333", "fontFamily": "OpenSans-Regular", "fontSize": 16.14791149129693, "lineHeight": 3.1, "text": "Sparrow Softtech", "textAlign": "center", "fontURL": "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf", "metadata": {} }, { "id": "916oTnxOTaBb27O9uz-rT", "name": "StaticImage", "angle": 0, "stroke": null, "strokeWidth": 0, "left": 134, "top": 268, "width": 32, "height": 32, "opacity": 1, "originX": "left", "originY": "top", "scaleX": 1, "scaleY": 1, "type": "StaticImage", "flipX": false, "flipY": false, "skewX": 0, "skewY": 0, "visible": true, "shadow": null, "src": "https://www.livedesimall.com/CDN/upload/659profile.png", "cropX": 0, "cropY": 0, "metadata": {} }], "name": "Untitled design" }], "metadata": {}, "preview": "" }
  //     };
  //     setJsonData(jsonData);
  // }, []);

  // modified code 

  useEffect(() => {
    if (jsonData && jsonData.data && jsonData.data.scenes) {
      setImages(createItemsFromJson(jsonData).filter((item) => item.type === 'image'));
      setTextItems(createTextItemsFromJson(jsonData));
    }
  }, [jsonData]);

  const createItemsFromJson = (json) => {
    const items = [];
    if (json && json.data && json.data.scenes) {
      const scenes = json.data.scenes;
      scenes.forEach((scene) => {
        const layers = scene.layers;
        layers.forEach((layer) => {
          if (layer.type === "StaticImage") {
            const newItem = {
              id: layer.id,
              type: "image",
              src: layer.src,
              left: layer.left,
              top: layer.top,
              width: layer.width,
              height: layer.height,
              scaleX: layer.scaleX,
              scaleY: layer.scaleY,
            };
            items.push(newItem);
          } else if (layer.type === "StaticText") {
            const newItem = {
              id: layer.id,
              type: "text",
              text: layer.text,
              left: layer.left,
              top: layer.top,
              width: layer.width,
              height: layer.height,
              fontFamily: layer.fontFamily,
              fontSize: layer.fontSize,
              fill: layer.fill,
              textAlign: layer.textAlign,
              scaleX: layer.scaleX,
              scaleY: layer.scaleY
            };
            items.push(newItem);
          }
        });
      });
    }
    return items;
  };

  const createTextItemsFromJson = (jsonData) => {
    if (!jsonData || !jsonData.data || !jsonData.data.scenes) {
      return []; // Return an empty array if jsonData or its properties are not available
    }

    const textItems = [];
    const scenes = jsonData.data.scenes;

    scenes.forEach((scene) => {
      const layers = scene.layers;
      console.log(layers)
      layers.forEach((layer) => {
        if (layer.type === "StaticText") {
          const newItem = {
            text: layer.text,
            isSelected: false,
            fontSize: layer.fontSize || 20,
            color: layer.fill || 'black',
            left: layer.left || 0,
            top: layer.top || 0,
            rotation: layer.angle || 0,
            scaleX: layer.scaleX || 1,
            scaleY: layer.scaleY || 1,
            textAlign: layer.textAlign || 'left'
          };
          textItems.push(newItem);
        }
      });
    });

    return textItems;
  };


  const handleImageSelect = useCallback((index) => {
    const updatedImages = images.map((image, i) => ({
      ...image,
      isSelected: i === index ? !image.isSelected : false,
    }));

    // Deselect text items when an image is selected
    const updatedTextItems = textItems.map((item) => ({
      ...item,
      isSelected: false,
    }));

    setImages(updatedImages);
    setTextItems(updatedTextItems);

    // If an image is deselected, reset selectedImageIndex and isImageSelected states
    if (updatedImages[index].isSelected === false) {
      setSelectedImageIndex(-1);
      setIsImageSelected(false);
    } else {
      setSelectedImageIndex(index);
      setIsImageSelected(true);
      // If an image is selected, deselect all text items
      setSelectedTextIndex(-1);
      setIsTextSelected(false);
    }
    setIsOpenFrame(false)
  }, [images, textItems]);

  const handleImageDelete = useCallback((index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    // If the selected image is deleted, reset selectedImageIndex and isImageSelected states
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
      setIsImageSelected(false);
    } else if (selectedImageIndex > index) {
      // If the deleted image is before the selected image, update the selectedImageIndex accordingly
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  }, [images, selectedImageIndex]);

  const handleTextSelect = useCallback((index) => {
    const updatedTextItems = textItems.map((item, i) => ({
      ...item,
      isSelected: i === index ? !item.isSelected : false,
    }));

    // Deselect image items when a text item is selected
    const updatedImages = images.map((image) => ({
      ...image,
      isSelected: false,
    }));

    setTextItems(updatedTextItems);
    setImages(updatedImages);

    // If a text item is deselected, reset selectedTextIndex and isTextSelected states
    if (updatedTextItems[index].isSelected === false) {
      setSelectedTextIndex(-1);
      setIsTextSelected(false);
    } else {
      setSelectedTextIndex(index);
      setIsTextSelected(true);
      // If a text item is selected, deselect all image items
      setSelectedImageIndex(-1);
      setIsImageSelected(false);
    }
    setIsOpenFrame(false)
  }, [textItems, images]);

  const handleTextDelete = useCallback((index) => {
    const updatedTextItems = [...textItems];
    updatedTextItems.splice(index, 1);
    setTextItems(updatedTextItems);

    if (selectedTextIndex === index) {
      setSelectedTextIndex(null);
      setIsTextSelected(false);
    } else if (selectedTextIndex > index) {
      setSelectedTextIndex(selectedTextIndex - 1);
    }
  }, [selectedTextIndex, textItems])

  const increaseImageSize = () => {
    if (selectedImageIndex !== null) {
      const updatedImages = [...images];
      const selectedImage = updatedImages[selectedImageIndex];
      selectedImage.width = (selectedImage.width || 150) + 20;
      selectedImage.height = (selectedImage.height || 150) + 20;
      setImages(updatedImages);
    }
  };

  const decreaseImageSize = () => {
    if (selectedImageIndex !== null) {
      const updatedImages = [...images];
      const selectedImage = updatedImages[selectedImageIndex];
      selectedImage.width = (selectedImage.width || 150) - 20;
      selectedImage.height = (selectedImage.height || 150) - 20;
      setImages(updatedImages);
    }
  };
  const rotateImage10Degrees = () => {
    if (selectedImageIndex !== null) {
      const updatedImages = [...images];
      const selectedImage = updatedImages[selectedImageIndex];
      selectedImage.rotation = (selectedImage.rotation || 0) + 10;
      setImages(updatedImages);
    }
  };
  const rotateImage10DegreesLeft = () => {
    if (selectedImageIndex !== null) {
      const updatedImages = [...images];
      const selectedImage = updatedImages[selectedImageIndex];
      selectedImage.rotation = (selectedImage.rotation || 0) - 10;
      setImages(updatedImages);
    }
  };

  const rotateImage90Degrees = () => {
    if (selectedImageIndex !== null) {
      const updatedImages = [...images];
      const selectedImage = updatedImages[selectedImageIndex];
      selectedImage.rotation = (selectedImage.rotation || 0) + 90;
      setImages(updatedImages);
    }
  };

  const addStaticImageToViewShot = () => {
    setImages([...images, { uri: staticImageUrl, isSelected: false }]);
  };

  const addTextToViewShot = () => {
    setTextItems([...textItems, { text: 'Sample Text', isSelected: false, fontSize: 20, color: 'black' }]);
  };

  const increaseTextSize = () => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      const selectedTextItem = updatedTextItems[selectedTextIndex];
      selectedTextItem.fontSize = (selectedTextItem.fontSize || 20) + 2;
      setTextItems(updatedTextItems);
    }
  };

  const decreaseTextSize = () => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      const selectedTextItem = updatedTextItems[selectedTextIndex];
      selectedTextItem.fontSize = (selectedTextItem.fontSize || 20) - 2;
      setTextItems(updatedTextItems);
    }
  };

  const rotateText10Degrees = () => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      const selectedTextItem = updatedTextItems[selectedTextIndex];
      selectedTextItem.rotation = (selectedTextItem.rotation || 0) + 10;
      setTextItems(updatedTextItems);
    }
  };

  const rotateText10DegreesLeft = () => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      const selectedTextItem = updatedTextItems[selectedTextIndex];
      selectedTextItem.rotation = (selectedTextItem.rotation || 0) - 10;
      setTextItems(updatedTextItems);
    }
  };

  const rotateText90Degrees = () => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      const selectedTextItem = updatedTextItems[selectedTextIndex];
      selectedTextItem.rotation = (selectedTextItem.rotation || 0) + 90;
      setTextItems(updatedTextItems);
    }
  };



  const getSelectedTextItemRotation = () => {
    if (selectedTextIndex !== null) {
      return textItems[selectedTextIndex].rotation || 0;
    }
    return 0;
  };

  //   const rotateImage90Degrees = () => {
  //     if (selectedImageIndex !== null) {
  //         const updatedImages = [...images];
  //         const selectedImage = updatedImages[selectedImageIndex];
  //         selectedImage.rotation = (selectedImage.rotation || 0) + 90;
  //         setImages(updatedImages);
  //     }
  // };

  const handleSliderValueChange = useCallback((value) => {
    if (selectedTextIndex !== null) {
      const updatedTextItems = [...textItems];
      updatedTextItems[selectedTextIndex].rotation = value;
      setTextItems(updatedTextItems);
    }
  }, [selectedTextIndex, textItems]);
  const handleSliderValueChangeI = useCallback((value) => {
    if (selectedImageIndex !== null) {
      const updatedTextItems = [...images];
      updatedTextItems[selectedImageIndex].rotation = value;
      //   const selectedImage = updatedImages[selectedImageIndex];
      //   selectedImage.rotation = (selectedImage.rotation || 0) + 90;
      setImages(updatedTextItems);
    }
  }, [selectedTextIndex, textItems]);

  // ------------------------------------------------------------------------------------------

  const [editingTextIndex, setEditingTextIndex] = useState(-1);
  const [editText, setEditText] = useState("")

  const handleEdit = useCallback((index, text) => {
    setEditingTextIndex(index);
    setEditText(text)
  }, [textItems])

  const handleSave = useCallback((updatedText, updatedColor) => {
    const updatedTextItems = [...textItems];
    updatedTextItems[editingTextIndex].text = updatedText;
    updatedTextItems[editingTextIndex].color = updatedColor; // Save the selected color
    setTextItems(updatedTextItems);
    setEditingTextIndex(-1);
  }, [textItems, editingTextIndex])

  const handleCanvasTap = () => {
    const updatedTextItems = textItems.map((item) => ({
      ...item,
      isSelected: false,
    }));

    // Deselect image items when a text item is selected
    const updatedImages = images.map((image) => ({
      ...image,
      isSelected: false,
    }));

    setTextItems(updatedTextItems);
    setImages(updatedImages);
    setIsImageSelected(false)
    setIsTextSelected(false)
  };

  // const rens

  useEffect(() => {
    Animated.spring(animatedRotation, {
      toValue: rotationValue,
      friction: 4,
      useNativeDriver: true, // Use the native driver for better performance (requires reanimated 2)
    }).start();
  }, [rotationValue]);



  const TextItem = ({
    text,
    isSelected,
    onDelete,
    onSelect,
    onEdit,
    width,
    height,
    rotation,
    fontSize,
    color,
    top,
    left,
    scaleX,
    scaleY,
    textAlign,
  }) => {
    return (
      <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
        <View
          style={{
            borderColor: isSelected ? 'black' : 'transparent',
            borderWidth: isSelected ? 2 : 0,
            top,
            left,
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize,
              color,
              textAlign,
            }}
          >
            {text}
          </Text>
          {isSelected && (
            <>
              <TouchableOpacity
                onPress={onDelete}
                style={{
                  position: 'absolute',
                  top: -13,
                  right: -13,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  height: 25,
                  width: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="trash" size={17} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onEdit}
                style={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  backgroundColor: 'blue',
                  padding: 5,
                  borderRadius: 10,
                  height: 25,
                  width: 25,
                }}
              >
                <Icon name="edit" size={15} color={'white'} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };


  // console.log(textItems[0]?.text)
  // console.log(editText)

  const [isOpenFrame, setIsOpenFrame] = useState(false)

  const handleFrame = () => {
    setSelectedTextIndex(-1);
    setIsTextSelected(false);
    setSelectedImageIndex(-1);
    setIsImageSelected(false);
    setIsOpenFrame(!isOpenFrame)

    const updatedTextItems = textItems.map((item, i) => ({
      ...item,
      isSelected: false,
    }));

    // Deselect image items when a text item is selected
    const updatedImages = images.map((image) => ({
      ...image,
      isSelected: false,
    }));

    setImages(updatedImages);
    setTextItems(updatedTextItems);
  }

  // custom frames

  // share 

  const captureAndShareImage = async () => {
    setSelectedTextIndex(-1);
    setIsTextSelected(false);
    setSelectedImageIndex(-1);
    setIsImageSelected(false);

    const updatedTextItems = textItems.map((item, i) => ({
      ...item,
      isSelected: false,
    }));

    // Deselect image items when a text item is selected
    const updatedImages = images.map((image) => ({
      ...image,
      isSelected: false,
    }));

    setImages(updatedImages);
    setTextItems(updatedTextItems);
    try {
      hideAlert5()

      const uri = await viewShotRef.current.capture();

      const fileName = 'sharedImage.jpg';
      const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      await RNFS.copyFile(uri, destPath);

      const shareOptions = {
        type: 'image/jpeg',
        url: `file://${destPath}`,
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const FrameAddorNot = () => {
    showAlert5()
  }
  const YesAddFrame = async () => {

    try {
      const uri = await viewShotRef.current.capture();

      hideAlert5()

      navigation.navigate('ChooseCustomFrame', {
        capturedImage: uri,
      });

    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  const [isModalVisible5, setModalVisible5] = useState(false);

  const showAlert5 = () => {
    setModalVisible5(true);
  };

  const hideAlert5 = () => {
    setModalVisible5(false);
  };

  // handle image picker

  console.log(images[0]?.id)

  // [{"height": 60, "id": "-2UZrscLPt1tNduHQ1X7y", "left": 20.54000000000002, "scaleX": 1, "scaleY": 1, "src": "https://www.livedesimall.com/CDN/upload/400face-icon-user-icon-design-user-profile-share-icon-avatar-black-and-white-silhouette-png-clipart-removebg-preview_2_optimized.png?auto=compress&cs=tinysrgb&h=60", "top": 21.900000000000006, "type": "image", "width": 60}]

  console.log(images)

  const handleProfileImageChange = () => {
    console.log("profile image nu funcation call thyu!")
    // Find the index of the image with the specified id
    const imageIndex = images.findIndex((image) => image.src === 'https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60');

    if (imageIndex !== -1) {
      // Open the image picker and replace the selected image with the new one
      ImageCropPicker.openPicker({
        width: 1000,
        height: 1000,
        cropping: true,
        includeBase64: true,
      })
        .then((response) => {
          const updatedImages = [...images];
          updatedImages[imageIndex] = {
            ...updatedImages[imageIndex],
            src: response.path,
          };
          setImages(updatedImages);
        })
        .catch((error) => {
          console.log('ImagePicker Error:', error);
        });
    } else {
      console.log("first")
    }
  };

  const handleImagePicker = (bg) => {
    ImageCropPicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      includeBase64: true,
    })
      .then((response) => {
        if (bg === 'Image') {
          setImages([
            ...images,
            { id: generateUniqueId(), src: response.path, isSelected: false }, // You need to generate a unique ID for the new image
          ]);
        } else {
          setFileUri(response.path);
        }
      })
      .catch((error) => {
        setImageLoader(false);
        console.log('ImagePicker Error:', error);
      });
  };

  const [customFrames, setCustomFrames] = useState([]);

  const saveCustomFrame = async (uri) => {


    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      let frames = framesData ? JSON.parse(framesData) : [];
      const frame = { name: `frame${frames.length + 1}`, image: uri };
      frames.push(frame);
      await AsyncStorage.setItem('customFrames', JSON.stringify(frames));
      setCustomFrames(frames);
      showAlert3()
    } catch (error) {
      console.error('Error saving custom frame:', error);
    }
  };

  const handleSaveToLocal = async () => {
    try {
      const updatedTextItems = textItems.map((item, i) => ({
        ...item,
        isSelected: false,
      }));

      // Deselect image items when a text item is selected
      const updatedImages = images.map((image) => ({
        ...image,
        isSelected: false,
      }));

      setImages(updatedImages);
      setTextItems(updatedTextItems);

      // const uri = await viewShotRef.current.capture();
      // await saveCustomFrame(uri);

      // console.log("save krva mate ni frame - ", uri)

      // // image cdn ma upload karva mate 

      // const dataArray = new FormData();
      // dataArray.append('b_video', {
      //   uri: uri,
      //   type: response.mime,
      //   name: uri.split('/').pop(),
      // });
      // setlocalImage(response.path)
      // let url = 'https://www.sparrowgroups.com/CDN/image_upload.php/';
      // axios
      //   .post(url, dataArray, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   })
      //   .then((res) => {
      //     setImageLoader(false)
      //     const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
      //     setFileUri(imagePath);
      //   })
      //   .catch((err) => {
      //     setImageLoader(false)
      //     setFileUri(response.path)
      //     console.log('Error uploading image:', err);
      //   });

      const uri = await viewShotRef.current.capture();
      await saveCustomFrame(uri);


      // Convert the file to base64
      // const base64Image = await convertFileToBase64(uri);

      // // Now you can use the base64Image as needed, e.g., send it to a CDN URL
      // console.log("Base64 image:", base64Image);

      // upload image to cdn url 

      // const apiUrl = "https://sparrowsofttech.in/cdn/index.php";
      // const requestData = {
      //   base64_content: base64Image, // Use the updated base64 image data here
      // };
      // // Upload the canvas image to the CDN
      // axios
      //   .post(apiUrl, requestData)
      //   .then(async (response) => {
      //     const { status, message, image_url } = response.data;
      //     if (status === "success") {
      //       console.log(image_url)
      //     } else {
      //       console.error("Image upload failed:", message);
      //     }
      //   })


    } catch (error) {
      console.error('Error saving image to local storage:', error);
    }
  };

  const convertFileToBase64 = async (fileUri) => {
    const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    return response;
  };

  const [isModalVisible3, setModalVisible3] = useState(false);

  const showAlert3 = () => {
    setModalVisible3(true);
  };

  const hideAlert3 = () => {
    navigation.navigate('SavedFramesProfile')
    setModalVisible3(false);
  };

  return (
    <LinearGradient
      colors={['#20AE5C', 'black']}
      style={{ flex: 1 }}
      locations={[0.1, 1]}>
      <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', marginBottom: 60 }}>

        <View style={styles.headerContainer}>
          <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
            <Icon name="angle-left" size={30} color={"black"} />
          </TouchableOpacity>
          <Text style={styles.headerText} onPress={() => { navigation.navigate('ProfileScreen') }}>
            Edit Frame
          </Text>
          <TouchableOpacity onPress={handleSaveToLocal}>
            <Text style={{ height: 30, width: 30 }}>
              <MaterialCommunityIcons name="content-save" size={30} color={"black"} />
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleCanvasTap}>
          <ViewShot
            ref={viewShotRef}
            style={{
              width: 300,
              height: 300,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'gray',
            }}
            onPress={handleCanvasTap}
          >

            <TouchableOpacity
              activeOpacity={1}
              style={{ height: '100%', width: '100%', }}
            >
              {images.map((image, index) => (
                <Draggable key={index}>
                  <ImageItem
                    uri={image.uri || image.src}
                    isSelected={image.isSelected}
                    width={image.width || 150}
                    height={image.height || 150}
                    rotation={image.rotation || 0}
                    top={image.top || 0}
                    left={image.left || 0}
                    onSelect={() => {
                      setSelectedImageIndex(index);
                      handleImageSelect(index);
                    }}
                    onDelete={() => handleImageDelete(index)}
                    scaleX={image.scaleX}
                    scaleY={image.scaleY}
                    id={image.id}
                  />
                </Draggable>
              ))}

              {textItems.map((textItem, index) => (
                <Draggable key={index}>
                  <TextItem
                    key={index}
                    text={textItem.text}
                    isSelected={textItem.isSelected}
                    width={150}
                    height={50}
                    rotation={textItem.rotation || 0}
                    fontSize={textItem.fontSize}
                    color={textItem.color} // Pass the color value for each text item
                    onSelect={() => {
                      setSelectedTextIndex(index);
                      handleTextSelect(index);
                    }}
                    top={textItem.top || 0}
                    left={textItem.left || 0}
                    onDelete={() => handleTextDelete(index, textItem.text)}
                    onEdit={() => handleEdit(index, textItem.text)} // Pass the onEdit function to the 
                    scaleX={textItem.scaleX}
                    scaleY={textItem.scaleY}
                    textAlign={textItem.textAlign}
                  />
                </Draggable>
              ))}
              <TextInputModal
                visible={editingTextIndex !== -1} // Show the modal when there's a text item being edited
                initialValue={editText} // Pass the initial text value when editing
                initialColor={editingTextIndex !== -1 ? textItems[editingTextIndex].color : 'red'} // Pass the initial text value when editing
                onSave={handleSave} // Save the updated text
                onClose={() => setEditingTextIndex(-1)} // Close the modal when editing is done
              />
            </TouchableOpacity>

          </ViewShot>
        </TouchableOpacity>
        <View style={{ width: '100%' }}>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 15,
              margin: 20,
              alignSelf: 'flex-end'
            }}
            onPress={handleProfileImageChange}
          >
            <Text>
              Profile Image
            </Text>
          </TouchableOpacity>

          {

            (isImageSelected && !isTextSelected) ? (

              <View>


                {/* Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    backgroundColor: 'white',
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowOffset: {
                      width: 0,
                      height: -2,
                    },
                    shadowOpacity: 1.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    alignItems: 'center',
                    paddingBottom: 20
                  }}
                >
                  {/* plus and minus buttons */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        marginRight: 15,
                      }}
                      onPress={decreaseImageSize}
                    >
                      <Icon name="minus" size={20} color={'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                      }}
                      onPress={increaseImageSize}
                    >
                      <Icon name="plus" size={20} color={'black'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (isTextSelected && !isImageSelected) ? (
              <View>

                {/* Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    backgroundColor: 'white',
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowOffset: {
                      width: 0,
                      height: -2,
                    },
                    shadowOpacity: 1.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    alignItems: 'center',
                    paddingBottom: 20
                  }}
                >
                  {/* plus and minus buttons */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        marginRight: 15,
                      }}
                      onPress={decreaseTextSize}
                    >
                      <Icon name="minus" size={20} color={'black'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                      }}
                      onPress={increaseTextSize}
                    >
                      <Icon name="plus" size={20} color={'black'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View>

              </View>
            )
          }

          {/* bottom */}
        </View>

      </View >

      <Modal
        animationType="fade" // You can use "fade" or "none" for animation type
        visible={isModalVisible3}
        transparent={true}
        onRequestClose={hideAlert3}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',

        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            height: "40%",
            width: 300,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* icon */}
            <TouchableOpacity onPress={hideAlert3} style={{
              backgroundColor: 'darkgreen',
              padding: 8,
              borderRadius: 8,
            }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
              }}><MaterialIcons name="check" size={25} color="white" /></Text>
            </TouchableOpacity>
            {/* title */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 10,
              color: 'darkgreen'
            }}>Your Frame Saved!</Text>
            {/* caption */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 5,
              color: 'lightgray'
            }}>... Thank You ...</Text>
            {/* another */}

            <TouchableOpacity onPress={hideAlert3} style={{
              width: 70,
              paddingVertical: 5,
              alignItems: 'center',
              justifyContent: "center",
              borderRadius: 8,
              marginTop: 30,
              backgroundColor: 'darkgreen'
            }}>
              <Text style={{
                color: 'white',
                fontFamily: 'Manrope-Bold'
              }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const TextInputModal = React.memo(({ visible, initialValue, initialColor, onSave, onClose }) => {
  const [textValue, setTextValue] = useState(initialValue);
  const [textColor, setTextColor] = useState(initialColor || 'black');

  useEffect(() => {
    setTextValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    onSave(textValue, textColor); // Pass both the textValue and textColor to the parent onSave function
    onClose();
  };

  const handleColorSelect = (color) => {
    setTextColor(color);
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
          }}
        >
          <TouchableWithoutFeedback onPress={() => { }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                value={textValue || ""}
                onChangeText={setTextValue}
                placeholder='add Text'
                style={{ borderWidth: 1, padding: 10, marginBottom: 10, color: textColor, width: 250, borderRadius: 10 }}
              />
              <FlatList
                data={colors}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleColorSelect(item)}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: item,
                      margin: 5,
                      borderRadius: 20,
                      borderWidth: textColor === item ? 2 : 0,
                    }}
                  />
                )}
              />
              <TouchableOpacity activeOpacity={1} style={{ backgroundColor: 'black', width: '100%', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 7 }} onPress={handleSave}>

                <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 17 }}>Save</Text>

              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

export default App;

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontFamily: "Manrope-Bold",
  },
  backgroundImage: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
})