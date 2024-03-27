import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  @Get('/')
  signUp() {
    return { status: 1 };
  }
}
