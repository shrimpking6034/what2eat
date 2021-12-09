import React from 'react';
import { Text, View, Dimensions, Image, Animated, PanResponder, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResultList from '../screens/ResultList';
import Axios from 'axios';
import {REACT_APP_API_KEY} from "@env";


const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const yelpAPIKEY = REACT_APP_API_KEY



let Foods = [
    { id: "1", uri: require('../assets/images/swipe.png'), likes: 0, name: "swipe" },
    { id: "2", uri: require('../assets/images/burger.jpeg'), likes: 0, name: "Burger" },
    { id: "3", uri: require('../assets/images/chicken.jpg'), likes: 0, name: "Fried Chicken" },
    { id: "4", uri: require('../assets/images/friedrice.jpg'), likes: 0, name: "Fried Rice" },
    { id: "5", uri: require('../assets/images/pasta.jpg'), likes: 0, name: "Pasta" },
    { id: "6", uri: require('../assets/images/pho.jpg'), likes: 0, name: "Pho" },
    { id: "7", uri: require('../assets/images/pizza.jpg'), likes: 0, name: "Pizza" },
    { id: "8", uri: require('../assets/images/salad.jpg'), likes: 0, name: "Salad" },
    { id: "9", uri: require('../assets/images/sushi.jpg'), likes: 0, name: "Sushi" },
    { id: "10", uri: require('../assets/images/burrito.jpg'), likes: 0, name: "Burrito" },
    { id: "11", uri: require('../assets/images/kungpao.jpg'), likes: 0, name: "Kung Pao Chicken" },
    { id: "12", uri: require('../assets/images/ramen.jpg'), likes: 0, name: "Ramen" },
    { id: "13", uri: require('../assets/images/sandwich.jpg'), likes: 0, name: "Sandwich" },
    { id: "14", uri: require('../assets/images/steak.jpg'), likes: 0, name: "Steak" },
    { id: "15", uri: require('../assets/images/macncheese.jpg'), likes: 0, name: "Mac and Cheese" },
    { id: "16", uri: require('../assets/images/curry.jpg'), likes: 0, name: "Curry" },
]

const storeData = async (value) => {
    try {
        const jsonVal = JSON.stringify(value)
        await AsyncStorage.setItem('foodH', jsonVal)
        restoreFoodsFromAsync()
    } catch (e) {
        console.log("err in storeData")
        console.dir(e)
    }
}


const restoreFoodsFromAsync = async () => {
    const value = await AsyncStorage.getItem('foodH');
    if (value !== null) {
        Foods = JSON.parse(value)
    } else {
        for (let item of Foods) {
            item.likes = 0
        }
    }
}

const restoreZipfromAsync =  async() => {
    const value = await AsyncStorage.getItem('zip');
    if (value !== null) {
        return JSON.parse(value)
    }else{
        return '02453'
    }
}

const accessFoodL = () => {
    return Foods
}

export default class Foodtemplate extends React.Component {


    constructor() {
        super()

        this.Foods = accessFoodL()

        this.position = new Animated.ValueXY()
        this.state = {
            currentIndex: 0,
            modalVisible: false,
            searchResult: null,
            loading: false,
            likedfood: '',
            zipCode: '02453'
        }

        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: ['-30deg', '0deg', '10deg'],
            extrapolate: 'clamp'
        })

        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
            ...this.position.getTranslateTransform()
            ]
        }

        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        })
        this.dislikeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        })

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        })
        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        })

    }

    yelpsearch = (searchterm) => {
        this.setState({zipCode: restoreZipfromAsync()})

        const config = {
            headers: { 'Authorization': 'Bearer ' + yelpAPIKEY },
            params: {
                limit: 10,
                term: searchterm,
                location: this.state.zipCode
            }
        };

        this.setState({ loading: true })
        Axios.get('https://api.yelp.com/v3/businesses/search', config)
            .then(response => {
                setTimeout(() => {
                    this.setState({
                        loading: false,
                        searchResult: response.data.businesses,
                        modalVisible: true
                    }),
                        console.log(this.state.searchResult)
                }, 1000)
            })
            .catch(error => {
                console.log(error);
            })
        return this.state.searchResult;
    };

    UNSAFE_componentWillMount() {
        this.PanResponder = PanResponder.create({

            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                restoreFoodsFromAsync()
                this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: (evt, gestureState) => {

                if (gestureState.dx > 120) {
                    Foods[this.state.currentIndex].likes++
                    storeData(Foods)
                    this.yelpsearch(Foods[this.state.currentIndex].name)
                    this.setState({ likedfood: Foods[this.state.currentIndex].name })

                    Animated.spring(this.position, {
                        toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
                        useNativeDriver: true,
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                }
                else if (gestureState.dx < -120) {
                    Animated.spring(this.position, {
                        toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
                        useNativeDriver: true,
                    }).start(() => {
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 })
                        })
                    })
                }
                else {
                    Animated.spring(this.position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                        useNativeDriver: true,
                    }).start()
                }
                if (this.state.currentIndex >= Foods.length - 1) {
                    this.state.currentIndex = 0;
                }
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchResult != prevProps.searchResult) {
            this.setState({ modalVisible: true })

            console.log(this.state)
            this.render()
        }
    }

    useEffect = (() => {
        restoreFoodsFromAsync()

        const interval = setInterval(() => {
            restoreFoodsFromAsync()
        }, 1000)


        return () => clearInterval(interval)
    }, [this.position])

    renderFood = () => {

        restoreFoodsFromAsync()

        return Foods.map((item, i) => {


            if (i < this.state.currentIndex) {
                return null
            }
            else if (i == this.state.currentIndex) {
                return (
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 150, width: SCREEN_WIDTH, padding: 50, position: 'absolute' }]}>

                        <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

                        </Animated.View>

                        <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

                        </Animated.View>

                        <Image
                            style={{ flex: 6, height: null, width: null, resizeMode: 'cover', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                            source={item.uri} />

                        <Animated.View style={{ flex: 1, }}>
                            <Text style={{ color: '#fff', fontSize: 20, padding: 10, backgroundColor: '#ccc', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                {item.name}         Liked: {item.likes}
                            </Text>
                        </Animated.View>

                    </Animated.View>
                )
            }
            else {
                return (
                    <Animated.View

                        key={item.id} style={[{
                            opacity: this.nextCardOpacity,
                            transform: [{ scale: this.nextCardScale }],
                            height: SCREEN_HEIGHT - 150, width: SCREEN_WIDTH, padding: 50, position: 'absolute'
                        }]}>
                        <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

                        </Animated.View>

                        <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

                        </Animated.View>

                        <Image
                            style={{ flex: 6, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                            source={item.uri} />

                        <Animated.View style={{ flex: 1, }}>
                            <Text style={{ color: '#fff', fontSize: 20, padding: 10, backgroundColor: '#ccc', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                {item.name}         Liked: {item.likes}
                            </Text>
                        </Animated.View>

                    </Animated.View>
                )
            }
        }).reverse()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {this.renderFood()}
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    opacity="50%"
                    full
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert("More details about restaurants will be supported soon.");
                        this.setState({modalVisible: false});
                    }}
                >
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.7)', height: SCREEN_HEIGHT * 3 / 4, width: SCREEN_WIDTH, marginTop: SCREEN_HEIGHT / 4, position: 'absolute', borderTopLeftRadius: 25, borderTopRightRadius: 25, opacity: 50 }}>
                        <Text style={{ color: 'white', fontWeight: "bold", fontSize: 32 }}> Restaurants for {this.state.likedfood} </Text>
                        <View style={{ marginLeft: SCREEN_WIDTH - 60 }}>
                            <Image style={{ width: 50, height: 20 }}
                                source={require('../assets/images/yelp_logo_dark_bg_cmyk.png')} />
                        </View>
                        <ResultList result={this.state.searchResult} />
                    </View>
                </Modal>
            </View>

        );
    }
}