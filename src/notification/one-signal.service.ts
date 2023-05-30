import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OneSignal from '@onesignal/node-onesignal';
import crypto from 'crypto';

@Injectable()
export class OneSignalService {
  readonly client: OneSignal.DefaultApi;
  constructor(private readonly configService: ConfigService) {
    const configuration = OneSignal.createConfiguration({
      authMethods: {
        app_key: {
          tokenProvider: this.app_key_provider,
        },
      },
    });
    this.client = new OneSignal.DefaultApi(configuration);
  }

  app_key_provider = {
    getToken() {
      return process.env.ONESIGNAL_REST_API_KEY;
    },
  };

  public createHashMac(identifier: string): string {
    const hmac = crypto.createHmac(
      'sha256',
      this.configService.get('ONESIGNAL_REST_API_KEY'),
    );
    hmac.update(identifier);
    return hmac.digest('hex');
  }
  
  public async push(
    subtitle: OneSignal.StringMap,
    contents: OneSignal.StringMap,
    isInApp:boolean,
    ...userIds: string[]
  ) {
    const notification = new OneSignal.Notification();
    notification.app_id = this.configService.get('ONESIGNAL_APP_ID');
    if (isInApp){
      notification.is_android
    }
    notification.subtitle = subtitle;
    notification.include_external_user_ids = userIds;
    notification.contents = contents;
    return this.client.createNotification(notification);
  }
}
