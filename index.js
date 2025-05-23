// index.js
import { AppRegistry } from 'react-native';
import App from './App'; // 반드시 ./App 이어야 해!
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
