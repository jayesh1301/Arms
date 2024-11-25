import { combineReducers } from 'redux';
import authReducer from './authantication/reducers';

const rootReducers = combineReducers({  
  auth: authReducer,  
});

export default rootReducers;
