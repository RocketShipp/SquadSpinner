import {combineReducers} from 'redux';
import reducerClientWindow from './reducer_clientWindow';
import reducerUserToken from './reducer_userToken';
import reducerErrorText from './reducer_errorText';
import reducerComponentTitle from './reducer_componentTitle';

const rootReducer = combineReducers({
  clientWindow: reducerClientWindow,
  userToken: reducerUserToken,
  errorText: reducerErrorText,
  componentTitle: reducerComponentTitle
});

export default rootReducer;
