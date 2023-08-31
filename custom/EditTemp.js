import { Slider } from '@rneui/base';
import React, { useRef, useState, useEffect, useCallback, isValidElement } from 'react';
import { View, Text, Button, Image, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, FlatList, Animated, Dimensions, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import Draggable from 'react-native-draggable';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewShot from 'react-native-view-shot';
// import Slider from 'react-native-slider'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import ImageCropPicker from 'react-native-image-crop-picker';
import { ToastAndroid } from 'react-native';

const { width } = Dimensions.get('window')

const staticImageUrl =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'; // Replace with your static image URL

const colors = ['black', 'red', 'blue', 'green', 'purple', 'cyan', 'magenta', 'orange', 'white'];

const ImageItem = React.memo(({ uri, isSelected, onDelete, onSelect, width, height, rotation, top, left, scaleX, scaleY, flipX, flipY }) => {
    const transformStyles = [];

    if (flipX) {
        transformStyles.push({ scaleX: -1 });
    }

    if (flipY) {
        transformStyles.push({ scaleY: -1 });
    }

    return (
        <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
            <View style={{ position: 'relative', top, left, transform: [{ rotate: `${rotation || 0}deg` }] }}>
                <Image
                    source={{ uri }}
                    style={{
                        width: width * scaleX || width || 100,
                        height: height * scaleY || height || 100,
                        borderColor: isSelected ? 'black' : 'transparent',
                        borderWidth: isSelected ? 2 : 0,
                        top: 0,
                        left: 0,
                        transform: transformStyles // Apply the flip transformations here
                    }}
                />
                {isSelected && (
                    <TouchableOpacity
                        onPress={onDelete}
                        style={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'red', padding: 5, borderRadius: 10, width: 25, alignItems: 'center', zIndex: 100 }}
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

    const [isload, setisload] = useState(true)

    const [data, setData] = useState([]);

    const [fileUri, setFileUri] = useState('https://img.freepik.com/premium-vector/white-texture-round-striped-surface-white-soft-cover_547648-928.jpg');

    const { imageId } = route.params;

    useEffect(() => {
        setImageLoader(true)
        // Define the URL for the GET request
        const apiUrl = `https://b-p-k-2984aa492088.herokuapp.com/cd_section/cds_data/${imageId}`;

        // Make the GET request using Axios
        axios
            .get(apiUrl)
            .then(response => {
                const imageData = response.data.data.cds_template;
                console.log(imageId)
                console.log(imageData)
                const data = {
                    data: imageData
                };
                setJsonData(data);
            })
            .catch(error => {
                console.error('Error fetching response.data.data:', error)
            });

            setisload(false)
        setImageLoader(false)

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
                            flipX: layer.flipX,
                            flipY: layer.flipY
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
                        textAlign: layer.textAlign || 'center',
                        width: layer.width || 200,
                        height: layer.height || 40
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
            selectedImage.width = (selectedImage.width || 150) + 10;
            selectedImage.height = (selectedImage.height || 150) + 10;
            setImages(updatedImages);
        }
    };

    const decreaseImageSize = () => {
        if (selectedImageIndex !== null) {
            const updatedImages = [...images];
            const selectedImage = updatedImages[selectedImageIndex];
            selectedImage.width = (selectedImage.width || 150) - 10;
            console.log(selectedImage)

            selectedImage.height = (selectedImage.height || 150) - 10;
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
        textAlign
    }) => {
        const scaledWidth = width;
        const scaledHeight = height*scaleY;

        console.log(scaledWidth)

        return (
            <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
                <View
                    style={{
                        transform: [
                            { rotate: `${rotation || 0}deg` },
                        ],
                        borderColor: isSelected ? 'black' : 'transparent',
                        borderWidth: isSelected ? 2 : 0,
                        top: top || 150,
                        left: left || 110,
                        justifyContent: 'center',
                        width: scaledWidth,
                        height: scaledHeight
                    }}
                >
                    <Text
                        style={{
                            fontSize,
                            color,
                            textAlign
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
                                    zIndex: 100
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
                                    zIndex: 100
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


    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
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


    // fetch the user team details 
    const [userTeamDetails, setUserTeamDetails] = useState([])

    console.log(userTeamDetails)

    // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

    // all users details 

    const [profileData, setProfileData] = useState(null);

    // setInterval(() => {
    //   retrieveProfileData()
    // }, 3000);
  
    useEffect(() => {
      retrieveProfileData()
    }, [retrieveProfileData])
  
    const retrieveProfileData = async () => {
      try {
        const dataString = await AsyncStorage.getItem('profileData');
        if (dataString) {
          const data = JSON.parse(dataString);
          setProfileData(data);
        }
      } catch (error) {
        console.error('Error retrieving profile data:', error);
      }
    };

    console.log(textItems)

    const fetchDetails = async () => {
        try {
            if (profileData) {

                const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/wallet/${profileData?.mobileNumber}`);
                const result = response.data;

                if (response.data.statusCode == 200) {
                    setUserTeamDetails('Purchase')
                } else {
                    console.log("user not data aavto nathi athava purchase request ma che ")
                }
            } else {
                console.log('details malti nathi!')
            }
        } catch (error) {
            console.log('Error fetching data... edit temp:', error);
        }finally{
            setTimeout(() => {
              setLoader(false)
            }, 1000);
          }
    }

    useEffect(() => {
        fetchDetails();
    })

    const [loader, setLoader] = useState(false)

    // share 

    const captureAndShareImage = async () => {

        if (userTeamDetails === 'Purchase') {
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

        } else {
            showToastWithGravity("Purchase MLM to share/download")
        }
    };

    const FrameAddorNot = () => {
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

    const [imageLoader, setImageLoader] = useState(false)

    const showAlert5 = () => {
        setModalVisible5(true);
    };

    const hideAlert5 = () => {
        setModalVisible5(false);
    };

    // handle image picker

    const handleImagePicker = (bg) => {
        ImageCropPicker.openPicker({
            width: 1000,
            height: 1000,
            cropping: true,
            includeBase64: true,
        })
            .then((response) => {
                if (bg === 'Image') {
                    const newImage = { uri: response.path, isSelected: false };
                    setImages((prevImages) => [...prevImages, newImage]);
                } else {
                    setFileUri(response.path);
                }
            })
            .catch((error) => {
                setImageLoader(false);
                console.log('ImagePicker Error:', error);
            });
    };

    if (isload) {
        <View style={{ backgroundColor: 'black', flex: 1, justifyContent: "center", alignItems: 'center' }}>
            <ActivityIndicator color={'white'} />
        </View>
    }


    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '83%', margin: 20 }}>
                <TouchableOpacity style={{ backgroundColor: "white", justifyContent: 'center', alignItems: 'center', height: 30, width: 30, borderRadius: 10 }} onPress={addStaticImageToViewShot}><Text><Icon name="cloud-upload" size={20} color={"black"} /></Text></TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "white", justifyContent: 'center', alignItems: 'center', height: 30, width: 50, borderRadius: 10 }} onPress={addTextToViewShot}><Text style={{ fontWeight: 'bold', color: 'black' }}> Text <Icon name="plus" size={20} color={"black"} /></Text></TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "white", justifyContent: 'center', alignItems: 'center', height: 30, width: 30, borderRadius: 10 }} onPress={addTextToViewShot}><Text style={{ fontWeight: 'bold', color: 'black' }}><Icon name="share" size={20} color={"black"} /></Text></TouchableOpacity>
            </View> */}

                <View style={styles.headerContainer}>
                    <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
                        <Icon name="angle-left" size={30} color={"white"} />
                    </TouchableOpacity>
                    <Text style={styles.headerText} onPress={() => { navigation.navigate('ProfileScreen') }}>
                        Edit
                    </Text>
                    <TouchableOpacity onPress={FrameAddorNot}>
                        <Text style={{ height: 30, width: 30 }}>
                            <MaterialCommunityIcons name="share-variant" size={30} color={"white"} />
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleCanvasTap} activeOpacity={1}>
                    <ViewShot
                        ref={viewShotRef}
                        style={{
                            width: 300,
                            height: 300,
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            elevation: 5,
                            borderRadius: 10
                        }}
                        onPress={handleCanvasTap}
                    >
                        <ImageBackground
                            source={{ uri: fileUri }} // Replace with the actual image path
                            style={styles.backgroundImage}
                        >

                            <TouchableOpacity
                                activeOpacity={1}
                                style={{ height: '100%', width: '100%' }}
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
                                            flipX={image.flipX}
                                            flipY={image.flipY}
                                        />
                                    </Draggable>
                                ))}

                                {textItems.map((textItem, index) => (
                                    <Draggable key={index}>
                                        <TextItem
                                            text={textItem.text}
                                            isSelected={textItem.isSelected}
                                            width={textItem.width || 150}
                                            height={textItem.height || 50}
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

                        </ImageBackground>
                    </ViewShot>
                </TouchableOpacity>
                <View style={{ width: '100%' }}>


                    {
                        (isImageSelected && !isTextSelected) ? (

                            <View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        width
                                    }}
                                >
                                    {/* Slider */}
                                    <View style={{ width: '100%', paddingHorizontal: 20 }}>
                                        <Slider
                                            style={{ width: '100%' }}
                                            minimumValue={0}
                                            maximumValue={360}
                                            step={1}
                                            value={rotationValue}
                                            onValueChange={(value) => {
                                                const updatedTextItems = [...images];
                                                updatedTextItems[selectedImageIndex].rotation = value;
                                                //   const selectedImage = updatedImages[selectedImageIndex];
                                                //   selectedImage.rotation = (selectedImage.rotation || 0) + 90;
                                                setImages(updatedTextItems);
                                            }}
                                            thumbStyle={{ backgroundColor: 'blue', width: 25, height: 25, borderRadius: 12.5, borderWidth: 2, borderColor: 'white' }}
                                            thumbTintColor="white"
                                            minimumTrackTintColor="blue"
                                            maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
                                        />
                                    </View>
                                </View>


                                {/* Buttons */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 20,
                                        paddingBottom: 20,
                                        backgroundColor: 'white',
                                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                                        shadowOffset: {
                                            width: 0,
                                            height: -2,
                                        },
                                        shadowOpacity: 1.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                        alignItems: 'center'
                                    }}
                                >
                                    {/* plus and minus buttons */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

                                    {/* Rotate 90 degrees button */}
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 30,
                                            width: 50,
                                            borderRadius: 10,
                                            flexDirection: 'row',
                                        }}
                                        onPress={rotateImage90Degrees}
                                    >
                                        <Text style={{ fontWeight: 'bold', color: 'black' }}>90 </Text>
                                        <Icon name="rotate-left" size={20} color={'black'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (isTextSelected && !isImageSelected) ? (
                            <View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'white',
                                        width
                                    }}
                                >
                                    {/* Slider */}
                                    <View style={{ width: '100%', paddingHorizontal: 20 }}>
                                        <Slider
                                            style={{ width: '100%' }}
                                            minimumValue={0}
                                            maximumValue={360}
                                            step={0.000000001}
                                            value={rotationValue}
                                            onValueChange={(value) => {
                                                const updatedTextItems = [...textItems];
                                                updatedTextItems[selectedTextIndex].rotation = value;
                                                setTextItems(updatedTextItems);
                                            }}
                                            thumbStyle={{ backgroundColor: 'blue', width: 25, height: 25, borderRadius: 12.5, borderWidth: 2, borderColor: 'white' }}
                                            thumbTintColor="white"
                                            minimumTrackTintColor="blue"
                                            maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
                                        />
                                    </View>
                                </View>

                                {/* Buttons */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 20,
                                        paddingBottom: 20,
                                        backgroundColor: 'white',
                                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                                        shadowOffset: {
                                            width: 0,
                                            height: -2,
                                        },
                                        shadowOpacity: 1.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                        alignItems: 'center'
                                    }}
                                >
                                    {/* plus and minus buttons */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

                                    {/* Rotate 90 degrees button */}
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 30,
                                            width: 50,
                                            borderRadius: 10,
                                            flexDirection: 'row',
                                        }}
                                        onPress={rotateText90Degrees}
                                    >
                                        <Text style={{ fontWeight: 'bold', color: 'black' }}>90 </Text>
                                        <Icon name="rotate-left" size={20} color={'black'} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View>

                            </View>
                        )
                    }

                    {/* bottom */}

                    <View style={{ height: 90, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

                        <TouchableOpacity activeOpacity={1} onPress={() => { handleImagePicker('Image') }} style={{ height: 60, width: 50, backgroundColor: 'white', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }}>

                            <View style={{ width: '100%' }}>
                                <Text style={{ color: 'black', textAlign: 'center' }}><MaterialCommunityIcons name="image" size={34} color={"black"} /></Text>
                            </View>
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>Image</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={addTextToViewShot} style={{ height: 60, width: 50, backgroundColor: 'white', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }}>

                            <View style={{ width: '100%' }}>
                                <Text style={{ color: 'black', textAlign: 'center' }}><MaterialCommunityIcons name="format-text" size={34} color={"black"} /></Text>
                            </View>
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>Text</Text>
                            </View>

                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => { handleImagePicker('bg') }} style={{ height: 60, width: 50, backgroundColor: 'white', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }}>

                            <View style={{ width: '100%' }}>
                                <Text style={{ color: 'black', textAlign: 'center' }}><MaterialCommunityIcons name="image-multiple" size={34} color={"black"} /></Text>
                            </View>
                            <View style={{ width: '100%' }}>
                                <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>BG-Image</Text>
                            </View>

                        </TouchableOpacity>

                    </View>
                </View>

            </View >

            <Modal
                animationType="fade" // You can use "fade" or "none" for animation type
                visible={isModalVisible5}
                transparent={true}
                onRequestClose={hideAlert5}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',

                }}>
                    <TouchableOpacity onPress={hideAlert5} style={{ position: 'absolute', top: 10, right: 20, backgroundColor: 'black' }}>
                        <Text style={{ fontSize: 30, color: 'white' }}>
                            <MaterialCommunityIcons name="close" size={34} color={"white"} />
                        </Text>
                    </TouchableOpacity>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        height: 230,
                        width: 300,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* icon */}
                        <TouchableOpacity onPress={hideAlert5} style={{
                            backgroundColor: 'red',
                            padding: 8,
                            borderRadius: 8,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                            }}><FontAwesome6 name="expand" size={25} color="white" /></Text>
                        </TouchableOpacity>
                        {/* title */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 10,
                            color: 'red'
                        }}>You want to Add Frame?</Text>
                        {/* another */}

                        <View style={{ flexDirection: 'row', gap: 40 }}>


                            <TouchableOpacity onPress={captureAndShareImage} style={{
                                width: 70,
                                paddingVertical: 5,
                                alignItems: 'center',
                                justifyContent: "center",
                                borderRadius: 8,
                                marginTop: 30,
                                borderColor: 'lightgray',
                                borderWidth: 1
                            }}>
                                <Text style={{
                                    color: 'darkgray',
                                    fontFamily: 'Manrope-Bold'
                                }}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={YesAddFrame} style={{
                                width: 100,
                                paddingVertical: 5,
                                alignItems: 'center',
                                justifyContent: "center",
                                borderRadius: 8,
                                marginTop: 30,
                                backgroundColor: 'red'
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontFamily: 'Manrope-Bold'
                                }}>Add Frame</Text>
                            </TouchableOpacity>

                        </View>

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
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, height: 200, justifyContent: 'center', alignItems: 'center', width: 300 }}>
                            <TextInput
                                value={textValue || "enter text"}
                                onChangeText={setTextValue}
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

                                <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 17, textAlign: 'center' }}>Save</Text>

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
        color: 'white',
        fontFamily: "Manrope-Bold",
    },
    backgroundImage: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
})