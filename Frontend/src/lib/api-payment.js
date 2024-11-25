import axios from 'axios';
import { PAYMENT_BASE_PATH } from './api-base-path';
import { ADD_BASE_PATH } from "./api-base-path";
export const payPalPayment = (data) => {
  console.log("data",data)
    try {
      return axios.post(`${PAYMENT_BASE_PATH}/paypalPayment`,data);
    } catch (error) {
      console.error('Error fetching :', error);
      throw error;
    }
  };


  export const sendOrderId = (data) => {
    console.log('lllllllllllllllllll',data);
    try {
      return axios.post(`${PAYMENT_BASE_PATH}/sendOrderId`,data);
    } catch (error) {
      console.error('Error fetching :', error);
      throw error;
    }
  };





export const loginEmployee = (data,controller) => {
  try {
    return axios.post(`${ADD_BASE_PATH}/login`,data, {
      signal: controller?.signal,
    });
  } catch (error) {
    console.error('Error fetching :', error);
    throw error;
  }
};