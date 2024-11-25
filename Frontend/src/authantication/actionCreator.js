import Cookies from 'js-cookie';
import actions from './actions';
import { loginEmployee } from '../lib/api-payment';

const { loginBegin, loginSuccess, loginErr, logoutBegin, logoutSuccess, logoutErr } = actions;

const login = ({ username, password }) => {
  return async (dispatch) => {
    try {
      dispatch(loginBegin());     
      const response = await loginEmployee({ username, password });
   
      if (response.data.status === 'Success') {
        const { token } = response.data;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);      
        const tokenDetails = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; Secure`;
        Cookies.set('logedIn', true);
        Cookies.set('token', tokenDetails);
        return dispatch(loginSuccess({login: true, token: tokenDetails}));
        
      } else {
        return dispatch(loginErr('Login unsuccessful. Status:', response.data.Status));
      }             
    } catch (err) {
      return dispatch(loginErr(err.message));
    }
  };
};

const logOut = () => {
  
  return async (dispatch) => {
    try {
      dispatch(logoutBegin());
      Cookies.remove('logedIn');
      Cookies.remove('token');
      return dispatch(logoutSuccess({login: false, token: null}));      
    } catch (err) {
      return dispatch(logoutErr(err.message));
    }
  };
};

export { login, logOut };
