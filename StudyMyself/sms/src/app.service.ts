import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class AppService {
  public constructor(private readonly twilioService: TwilioService) {}

  getHello(): string {
    return 'Hello World!';
  }
  async sendSMS() {
    return this.twilioService.client.messages.create({
      body: 'SMS Body, sent to the phone!',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.TARGET_PHONE_NUMBER,
    });
  }
  //   const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  // const authToken = 'your_auth_token';

  // const client = require('twilio')(accountSid, authToken);

  // client.messages
  //   .create({
  //     body: 'Hello from twilio-node',
  //     to: '+12345678901', // Text your number
  //     from: '+12345678901', // From a valid Twilio number
  //   })
  //   .then((message) => console.log(message.sid));
}
