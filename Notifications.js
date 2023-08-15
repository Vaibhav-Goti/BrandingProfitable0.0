import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const data = Array.from({ length: 10 }, (_, index) => index + 1);

const Notifications = ({ navigation }) => {
    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>
            {/* header */}

            <View
                style={{
                    flexDirection: 'row',
                    height: 50,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                }}>
                <Text style={{ color: 'white', padding: 10 }} onPress={() => { navigation.goBack() }} >
                    <Icon name="angle-left" size={30} color={'white'} />
                </Text>
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontFamily: 'Manrope-Bold',
                        marginLeft: 15,
                    }}>
                    {' '}
                    Notifications{' '}
                </Text>
            </View>
            <ScrollView>
                {data.map((item, index) => (
                    <View style={{ padding: 20, backgroundColor: '#050505', margin: 20, borderRadius: 10, flexDirection: 'row', elevation: 5, marginBottom:index==data.length-1?20:0 }} key={index}>
                        <Text>
                            <MaterialCommunityIcons name="message-text" size={25} color={'white'} />
                        </Text>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 17, marginBottom: 4 }}>
                                New Notification
                            </Text>
                            <Text style={{ color: 'gray', fontFamily: 'Inter-Bold', fontSize: 13, }}>
                                Do ullamco ex velit anim do proident et anim exercitation et anim tempor.jk
                            </Text>
                            <Text style={{ color: 'gray', fontFamily: 'Inter-Bold' }}>
                                21 june 2023
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({});

export default Notifications;
