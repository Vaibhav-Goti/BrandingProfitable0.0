import { View, Text, StyleSheet, Button, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import WebViewScreen from './Webview'
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

const { height } = Dimensions.get('window')

// const treeData = {
//   name: 'Meet',
//   referralId: 'REF123',
//   treeId: '123123123123',
//   children: [
//     {
//       name: 'Bhavin',
//       referralId: 'REF234',
//       treeId: '234123123123',
//       side: 'left', // Add side parameter
//       children: [
//         {
//           name: 'Dinesh',
//           referralId: 'REF345',
//           treeId: '345123123123',
//           side: 'left', // Add side parameter
//           children: [
//             { name: 'Hardik', referralId: 'REF456', treeId: '456' },
//             { name: 'Iran', referralId: 'REF456', treeId: '456' },
//           ],
//         },
//         {
//           name: 'Emran',
//           referralId: 'REF456',
//           treeId: '456123123123',
//           side: 'right', // Add side parameter


//         },
//       ],
//     },
//     {
//       name: 'Chirag',
//       referralId: 'REF567',
//       treeId: '567',
//       side: 'right', // Add side parameter
//       children: [
//         {
//           name: 'Faizan',
//           referralId: 'REF678',
//           treeId: '678',
//           side: 'left', // Add side parameter
//         },
//         {
//           name: 'Vaibhav',
//           referralId: 'REF789',
//           treeId: '789',
//           side: 'right', // Add side parameter
//           children: [
//             { name: 'Hardik', referralId: 'REF456', treeId: '456' },
//             {
//               name: 'Iran',
//               referralId: 'REF456',
//               treeId: '456',
//               side: 'left', // Add side parameter
//               children: [
//                 { name: 'Hardik', referralId: 'REF456', treeId: '456' },
//                 { name: 'Iran', referralId: 'REF456', treeId: '456' },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// const DirectSponser = {
//   "statusCode": 200,
//   "name": "A",
//   "referralId": "1",
//   "treeId": 26561,
//   "side": "left",
//   "redWallet": 0,
//   "greenWallet": 500,
//   "children": [
//     {
//       "name": "B",
//       "referralId": "2",
//       "treeId": 66027,
//       "side": "right",
//       "redWallet": 0,
//       "greenWallet": 500
//     },
//     {
//       "name": "C",
//       "referralId": "3",
//       "treeId": 81546,
//       "side": "left",
//       "redWallet": 0,
//       "greenWallet": 500
//     }
//   ]
// }


const MLMScreen2 = ({ navigation, route }) => {

  const {aadhar, id} = route.params

  console.log("this is my moile number: ", aadhar)

  console.log("phone number from main - ", aadhar)

  const [isLeft, setIsLeft] = React.useState(true)
  const [isRight, setIsRight] = React.useState(false)
  const [isDirect, setIsDirect] = React.useState(false)
  
const [treeData, setTreeData] = React.useState([])
const [DirectSponser, setDirectSponser] = React.useState([])

  const handleLeftClick = (variable) => {
    if (variable == 'left') {
      setIsLeft(true)
      setIsRight(false)
      setIsDirect(false)
    } else if (variable == 'right') {
      setIsLeft(false)
      setIsRight(true)
      setIsDirect(false)
    } else {
      setIsLeft(false)
      setIsRight(false)
      setIsDirect(true)
    }
  }

  // user coount 

  const findFirstChildBySide = (node, side) => {
    if (!node || !node.children) {
      return null;
    }

    for (const child of node.children) {
      if (child.side === side) {
        return child;
      }
    }

    return null;
  };
  const findFirstChildDirect = (node, side) => {
    if (!node || !node.children) {
      return null;
    }

    for (const child of node.children) {
      if (child.side === side) {
        return child;
      }
    }

    return null;
  };

  const countUsersInNode = node => {
    if (!node) {
      return 0;
    }

    let count = 1; // Count the current node

    if (node.children) {
      node.children.forEach(child => {
        count += countUsersInNode(child);
      });
    }

    return count;
  };

  const firstChildWithRightSide = findFirstChildBySide(treeData, 'right');
  const firstChildWithLeftSide = findFirstChildBySide(treeData, 'left');

  const numberOfChildren = DirectSponser.children ? DirectSponser.children.length : 0
  console.log(numberOfChildren,"sdfjkdkf")

  // Count users under the first child with side 'right'
  const userCountRight = firstChildWithRightSide
    ? countUsersInNode(firstChildWithRightSide)
    : 0;
  const userCountLeft = firstChildWithLeftSide
    ? countUsersInNode(firstChildWithLeftSide)
    : 0;

  const userCountAll = userCountLeft + userCountRight + 1;

  console.log(userCountLeft, userCountRight, userCountAll)

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/user/directresponce/${aadhar}`);

      console.log(`https://b-p-k-2984aa492088.herokuapp.com/user/directresponce/${aadhar}`)

      const result = response.data;
      setDirectSponser(result);
    } catch (error) {
      console.log('Error fetching data... mlm 2:', error);
    }
  };
  const fetchData2 = async () => {
    try {
      const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/user/treeview/${aadhar}`);

      const result = response.data;
      setTreeData(result);
    } catch (error) {
      console.log('Error fetching data... mlm 2:', error);
    }
  };

  useEffect(() => {
    fetchData()
    fetchData2()
  }, [])

  return (
    <LinearGradient colors={['#20AE5C', '#000']} locations={[0.3, 1]} style={{ flex: 1, }}>

      <ScrollView style={{ flex: 1, paddingBottom: 20 }}>

        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, { width: 30 }]} onPress={() => { navigation.goBack() }}>
            <Icon name="angle-left" size={30} />
          </Text>
          <Text style={styles.headerText}>
            Team
          </Text>
          <View style={{ width: 30 }}>

          </View>
        </View>

        <View style={{ height: 130, borderRadius: 20, backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 20 }}>
          <Text style={{ color: '#00D3FF', fontSize: 17, fontFamily: 'Manrope-Regular' }}>Total Team:  <Text style={{ fontSize: 20, color: 'white' }}>{userCountAll}</Text></Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
            {/* 1 */}
            <TouchableOpacity onPress={() => { handleLeftClick('left') }} style={{ height: 30, borderRadius: 50, backgroundColor: isLeft ? '#E31E25' : 'white', paddingHorizontal: 5, justifyContent: 'center', flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 5 }}>
              <View style={{ backgroundColor: isLeft ? 'black' : 'lightgray', borderRadius: 100, height: 22, alignItems: 'center', justifyContent: 'center', minWidth: 22 }}><Text style={{ color: isLeft ? '#E31E25' : 'white', fontSize: 10, fontFamily: 'DMSans_18pt-Bold', paddingHorizontal: 4 }}>{userCountLeft}</Text></View>
              <View style={{ marginRight: 3 }}>
                <Text style={{ color: isLeft ? 'white' : 'lightgray', fontFamily: 'DMSans_18pt-Bold' }}>
                  Left Team
                </Text>
              </View>
            </TouchableOpacity>
            {/* 1 */}
            <TouchableOpacity onPress={() => { handleLeftClick('right') }} style={{ height: 30, borderRadius: 50, backgroundColor: isRight ? '#E31E25' : 'white', paddingHorizontal: 5, justifyContent: 'center', flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 5 }}>
              <View style={{ backgroundColor: isRight ? 'black' : 'lightgray', borderRadius: 100, height: 22, alignItems: 'center', justifyContent: 'center', minWidth: 22 }}><Text style={{ color: isRight ? '#E31E25' : 'white', fontSize: 10, fontFamily: 'DMSans_18pt-Bold', paddingHorizontal: 4 }}>{userCountRight}</Text></View>
              <View style={{ marginRight: 3 }}>
                <Text style={{ color: isRight ? 'white' : 'lightgray', fontFamily: 'DMSans_18pt-Bold' }}>
                  Right Team
                </Text>
              </View>
            </TouchableOpacity>
            {/* 1 */}
            <TouchableOpacity onPress={() => { handleLeftClick('direct') }} style={{ height: 30, borderRadius: 50, backgroundColor: isDirect ? '#E31E25' : 'white', paddingHorizontal: 5, justifyContent: 'center', flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 5 }}>
              <View style={{ backgroundColor: isDirect ? 'black' : 'lightgray', borderRadius: 100, height: 22, alignItems: 'center', justifyContent: 'center', minWidth: 22 }}><Text style={{ color: isDirect ? '#E31E25' : 'white', fontSize: 10, fontFamily: 'DMSans_18pt-Bold', paddingHorizontal: 4 }}>{numberOfChildren}</Text></View>
              <View style={{ marginRight: 3 }}>
                <Text style={{ color: isDirect ? 'white' : 'lightgray', fontFamily: 'DMSans_18pt-Bold' }}>
                  Direct Sponser
                </Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>
        <LinearGradient colors={['#20AE5C', '#000']} locations={[0.3, 1]} style={{ height: height - 140 - 100 }}>

          <View style={{ height: height - 300 }}>

            <WebViewScreen
              isLeft={isLeft}
              isRight={isRight}
              isDirect={isDirect}
              treeData={isDirect ? DirectSponser : treeData}
            />

          </View>
          <TouchableHighlight style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: "#20AE5C", height: 60, borderRadius: 20, marginTop: -30 }} onPress={()=>{navigation.navigate('WithdrawWallet')}}>

            <Text style={{ fontFamily: 'DMSans_18pt-Bold', fontSize: 18, color: 'white' }}>
              Withdraw Green Wallet
            </Text>
          </TouchableHighlight>
        </LinearGradient>

      </ScrollView>

    </LinearGradient>
  )
}

export default MLMScreen2

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
    fontFamily:'Manrope-Bold'
  }
})