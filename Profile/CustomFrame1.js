import { Slider } from '@rneui/base';
import React, { useRef, useState, useEffect, useCallback, isValidElement } from 'react';
import { View, Text, Button, Image, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, FlatList, Animated, Dimensions, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
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
import { ToastAndroid } from 'react-native';

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

  const { itemId, isRequest } = route.params;

  console.log("request ni frame mathi aaveli id: ", itemId)

  // profile data getting --------------------------------------------------------------------------------

  const [profileData, setProfileData] = useState(null);
  const [userToken, setUserToken] = useState()

  // setInterval(() => {
  //   retrieveProfileData()
  // }, 3000);

  useEffect(() => {
    retrieveProfileData()
  }, [retrieveProfileData])

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      const userToken = await AsyncStorage.getItem('userToken');
      setUserToken(userToken)
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    }
  };

  // --------------------------------------------------------------------------------

  // if request then get data from another api 

  const [loadig, setisloading] = useState(true)



  useEffect(() => {
    // Define the URL for the GET request
    const apiUrl = isRequest === 'no' ? `https://b-p-k-2984aa492088.herokuapp.com/frame/frameimage/${itemId}` : `https://b-p-k-2984aa492088.herokuapp.com/saveframe/frameimage/${itemId}`;

    const fetchData = async () => {
      try {
        if (isRequest === 'no') {
          console.log('calling frames');
          console.log(`https://b-p-k-2984aa492088.herokuapp.com/frame/frameimage/${itemId}`)
        } else {
          console.log('calling save frames');
          console.log(`https://b-p-k-2984aa492088.herokuapp.com/saveframe/frameimage/${itemId}`)
        }

        const response = await axios.get(apiUrl);
        const imageData = response.data.data.frame;
        const data = {
          data: imageData
        };
        console.log(imageData);
        setJsonData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error, show a message to the user, or retry the request if needed
      }
    };

    fetchData();
    setisloading(false)
  }, [itemId, isRequest]);
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

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };


  const [customFrames, setCustomFrames] = useState([]);

  const saveCustomFrame = async (uri) => {

    console.log("saving this image url in async storage: ", uri)

    try {

      navigation.goBack()
      const framesData = await AsyncStorage.getItem('customFrames');
      let frames = framesData ? JSON.parse(framesData) : [];
      const frame = { name: `frame${frames.length + 1}`, image: uri };
      frames.push(frame);
      await AsyncStorage.setItem('customFrames', JSON.stringify(frames));
      setCustomFrames(frames);
      showToastWithGravity("Your Frame Saved!")

    } catch (error) {
      console.error('Error saving custom frame:', error);
    }
  };


  // const rens

  useEffect(() => {
    Animated.spring(animatedRotation, {
      toValue: rotationValue,
      friction: 4,
      useNativeDriver: true, // Use the native driver for better performance (requires reanimated 2)
    }).start();
  }, [rotationValue]);



  const [isOpenFrame, setIsOpenFrame] = useState(false)

  // custom frames

  const handleProfileImageChange = () => {

    // Find the index of the image with the specified id
    const imageIndex = images.findIndex((image) => (
      image.src === 'https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60' ||
      image.src === profileData?.profileImage ||
      image.src === profileData?.businessLogo
    ));

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
      console.log("image not found")
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
      // await saveCustomFrame(uri);


      // Convert the file to base64
      const base64Image = await convertFileToBase64(uri);

      console.log("base64: ", base64Image)

      // Now you can use the base64Image as needed, e.g., send it to a CDN URL
      console.log("Base64 image:", base64Image);

      // upload image to cdn url 

      const apiUrl = "https://sparrowsofttech.in/cdn/index.php";
      const requestData = {
        base64_content: base64Image, // Use the updated base64 image data here
      };
      // Upload the canvas image to the CDN
      axios
        .post(apiUrl, requestData)
        .then(async (response) => {
          console.log("requesting for change to cdn")
          const { status, message, image_url } = response.data;
          
          
          console.log(image_url, "this is my image url")
          if (status === "success") {
            await saveCustomFrame(image_url);
            // sendFrametoDb(image_url)

          } else {
            console.error("Image upload failed:", message);
          }
        })


    } catch (error) {
      console.error('Error saving image to local storage:', error);
    }
  };

  const convertFileToBase64 = async (fileUri) => {
    const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    return response;
  };

  const sendFrametoDb = async (image_url) => {
    const apiUrl = 'https://b-p-k-2984aa492088.herokuapp.com/saveframe/frame/save';
    const requestData = {
      "userId": profileData?._id,
      "fullName_user": profileData?.fullName,
      "mobileNumber_user": profileData?.mobileNumber,
      "savedFrame_user": image_url
    }

    // sending user frames to data base 
    try {
      const response = await axios.post(
        apiUrl, requestData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Error sending saved frames data:', error);
    }
  }

  // update the user data 
  const phone = profileData?.mobileNumber;
  const username = profileData?.fullName;
  const des = profileData?.Designation;
  const userimage = profileData?.profileImage || profileData?.businessLogo;

  const [run, setRun] = useState(true);

  useEffect(() => {
    // Update text items
    if (run && textItems.length !== 0 && userimage && phone && username) {
      const updatedTextItems = textItems.map((item) => {
        if (item.text === '1234567890') {
          return { ...item, text: phone }; // Update the text property
        }
        if (item.text === 'Your Name Here') {
          return { ...item, text: username }; // Update the text property
        }
        if (item.text === 'Your Designation') {
          return { ...item, text: username }; // Update the text property
        }
        return item; // Keep the item as is if the condition is not met
      });

      setTextItems(updatedTextItems); // Update the state with the modified array
      setRun(false);
    }

    // Update image items
    if (run && images.length !== 0 && userimage && phone && username) {
      const updatedImageItems = images.map((item) => {
        if (item.src === 'https://www.sparrowgroups.com/CDN/upload/840image-removebg-preview.png?auto=compress&cs=tinysrgb&h=60') {
          return { ...item, src: userimage }; // Update the src property
        }
        return item; // Keep the item as is if the condition is not met
      });
      setImages(updatedImageItems); // Update the state with the modified arra
      setRun(false);
    }
  }, [run, textItems, images, phone, username, userimage]);

  const TextItem = React.memo(({
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
  });

  console.log(loadig, textItems.length, images.length)

  if (loadig || !jsonData ) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator color={'white'} />
      </View>
    )
  }

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