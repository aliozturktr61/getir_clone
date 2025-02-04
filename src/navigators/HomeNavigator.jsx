import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CategoryFilterScreen from '../screens/CategoryFilterScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import {CloseCircle, Heart, Trash} from 'iconsax-react-native';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import CartScreen from '../screens/CartScreen';
import {connect} from 'react-redux';
import * as actions from '../redux/actions/cartActions';

const {width, height} = Dimensions.get('window');
const Stack = createNativeStackNavigator();
function MyStack({navigation, route, cartItems, clearCart}) {
  const tabHiddenRoutes = ['ProductDetails', 'CartScreen'];
  const [totalPrice, setTotalPrice] = useState(0);

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (tabHiddenRoutes.includes(routeName)) {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({tabBarStyle: {display: 'block'}});
    }
  }, [navigation, route]);

  const getProductsPrice = () => {
    var total = 0;
    cartItems.forEach(cartItem => {
      const price = (total += cartItem.product.fiyatIndirimli);
      setTotalPrice(price);
    });
    cartItems.length ? null : setTotalPrice(0);
  };

  useEffect(() => {
    getProductsPrice();
  }, [cartItems, navigation, route]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyle: {backgroundColor: '#5C3EBC'},
          headerTitle: () => (
            <Image
              source={require('../../assets/getirlogo.png')}
              style={{width: 70, height: 30}}
            />
          ),
        }}
      />
      <Stack.Screen
        name="CategoryDetails"
        component={CategoryFilterScreen}
        options={{
          headerTintColor: 'white',
          headerBackTitleVisible: false,
          headerStyle: {backgroundColor: '#5C3EBC'},
          headerTitle: () => (
            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>
              Ürünler
            </Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('CartScreen')}
              style={{
                width: width * 0.2,
                height: 33,
                backgroundColor: 'white',
                marginRight: width * 0.03,
                borderRadius: 9,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 23, height: 23, marginLeft: 6}}
                source={require('../../assets/cart.png')}
              />
              <View style={{height: 33, width: 4, backgroundColor: 'white'}} />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 33,
                  backgroundColor: '#F3EFFE',
                  borderTopRightRadius: 9,
                  borderBottomRightRadius: 9,
                }}>
                <Text
                  style={{color: '#5D3EBD', fontWeight: 'bold', fontSize: 12}}>
                  ₺{totalPrice.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        options={{
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          headerStyle: {backgroundColor: '#5C5EBC'},
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                paddingLeft: 8,
              }}>
              <CloseCircle size={24} color="white" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 15}}>
              Ürün Detayı
            </Text>
          ),
          headerRight: () => (
            <TouchableOpacity style={{paddingRight: 8}}>
              <Heart variant="Bold" size={24} color="#32177a" />
            </TouchableOpacity>
          ),
        }}
        component={ProductDetailsScreen}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          headerTintColor: 'white',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#5C3EBC',
          },
          headerTitle: () => (
            <Text style={{fontWeight: 'bold', fontSize: 15, color: 'white'}}>
              Sepetim
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <CloseCircle size={26} color="white" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => clearCart()}>
              <Trash size={26} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

const mapStateToProps = state => {
  const {cartItems} = state;
  return {
    cartItems: cartItems,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

function HomeNavigator({navigation, route, cartItems, clearCart}) {
  return (
    <MyStack
      navigation={navigation}
      route={route}
      cartItems={cartItems}
      clearCart={clearCart}
    />
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeNavigator);


const styles = StyleSheet.create({});
