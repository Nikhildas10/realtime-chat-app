import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(1, 2, 3);
    return 'Hello World!';
  }
}
