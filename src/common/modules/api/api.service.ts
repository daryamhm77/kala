import { HttpModuleOptions } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApiService {
  constructor() {}

  async meliPayamakSendVerifySms(
    parameters?: string,
    config?: HttpModuleOptions,
  ) {
    const { MELIPAYAMAK_SEND_OTP_SMS_URL } = process.env;
    try {
      const result = await axios.post(
        MELIPAYAMAK_SEND_OTP_SMS_URL,
        parameters,
        config,
      );
      return result.data;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async zarinpalPostRequest(data?: any, config?: HttpModuleOptions) {
    const { ZARINPAL_REQUEST_URL } = process.env;

    try {
      const result = await axios.post(ZARINPAL_REQUEST_URL, data, config);
      return result.data;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
  async zarinpalVerifyRequest(data?: any, config?: HttpModuleOptions) {
    const { ZARINPAL_VERIFY_URL } = process.env;
    try {
      const result = await axios.post(ZARINPAL_VERIFY_URL, data, config);
      return result.data;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
