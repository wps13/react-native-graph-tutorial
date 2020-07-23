import React from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {DrawerToggle, headerOptions} from '../menus/HeaderComponents';
import {GraphManager} from '../graph/GraphManager';
import {GraphAuthProvider} from '../graph/GraphAuthProvider';

const Stack = createStackNavigator();
const UserState = React.createContext({
  userLoading: true,
  userName: '',
  userEmail: '',
  userToken: '',
});

type HomeScreenState = {
  userLoading: boolean;
  userName: string;
  userEmail: string;
  userToken: string;
};

const HomeComponent = () => {
  const userState = React.useContext(UserState);

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={userState.userLoading} size="large" />
      {userState.userLoading ? null : (
        <View>
          <Text>Hello {userState.userName}!</Text>
          <Text>Email {userState.userEmail}</Text>
          <Text>Token</Text>
          <Text>{userState.userToken}</Text>
        </View>
      )}
    </View>
  );
};

export default class HomeScreen extends React.Component {
  state: HomeScreenState = {
    userLoading: true,
    userName: '',
    userEmail: '',
    userToken: '',
  };

  async componentDidMount() {
    try {
      const authProvider = new GraphAuthProvider();
      const token = await authProvider.getAccessToken();
      // Get the signed-in user from Graph
      const user = await GraphManager.getUserAsync();
      // Set the user name to the user's given name
      console.log(user);
      this.setState({
        userName: user.givenName,
        userLoading: false,
        userToken: token,
        userEmail: user.userPrincipalName,
      });
    } catch (error) {
      Alert.alert(
        'Error getting user',
        JSON.stringify(error),
        [
          {
            text: 'OK',
          },
        ],
        {cancelable: false},
      );
    }
  }

  render() {
    return (
      <UserState.Provider value={this.state}>
        <Stack.Navigator screenOptions={headerOptions}>
          <Stack.Screen
            name="Home"
            component={HomeComponent}
            options={{
              title: 'Welcome',
              headerLeft: () => <DrawerToggle />,
            }}
          />
        </Stack.Navigator>
      </UserState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
