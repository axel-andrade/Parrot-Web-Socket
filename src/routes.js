import { createStackNavigator } from 'react-navigation';

import Main from './pages/main';

export default createStackNavigator({
    'Main': {
        screen: Main,
        navigationOptions: ({ navigation }) => {
            return ({ header: null });
        }
    },
}, {
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#6AA84F'
            },
            headerTintColor: 'white'
        }
    });

