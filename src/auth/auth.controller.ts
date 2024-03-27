import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signUp.dto';
import { signInDto } from './dto/signIn.dto';
import { verifyAccountDto } from './dto/verifyAccount.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { SWAGGER_MESSAGES } from '../utils/messages';
import { Utils } from '../utils/utilFunctions';
import response, {
  forgotPasswordResponseDto,
  resetPasswordResponseDto,
  signInResponseDto,
  signupResponseDto,
  verifyAccountResponseDto,
} from './dto/response.dto';
import { ApiDataResponse } from '../decorators/swagger.decorator';
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'Successfully registered',
  })
  @ApiResponse(SWAGGER_MESSAGES[400])
  @ApiResponse(SWAGGER_MESSAGES[500])
  @ApiDataResponse(signupResponseDto)
  @ApiOperation({
    summary: 'User registration to app',
  })
  async signUp(@Body() body: signUpDto) {
    const data = await this.authService.signUp(body);
    return Utils.sendResponse(data, 'success');
  }

  @Post('/verify-account')
  @ApiResponse({
    status: 201,
    description: 'Successfully verified',
  })
  @ApiDataResponse(verifyAccountResponseDto)
  @ApiResponse(SWAGGER_MESSAGES[400])
  @ApiResponse(SWAGGER_MESSAGES[500])
  @ApiOperation({
    summary: 'User Otp verification',
  })
  async verifyAccount(@Body() verifyAccount: verifyAccountDto) {
    const data = await this.authService.verifyAccount(verifyAccount);
    return Utils.sendResponse(data, 'success');
  }

  @Post('/signin')
  @ApiDataResponse(signInResponseDto)
  @ApiResponse(SWAGGER_MESSAGES[400])
  @ApiResponse(SWAGGER_MESSAGES[500])
  @ApiOperation({
    summary: 'User login in the app',
  })
  async signIn(@Body() body: signInDto) {
    const data = await this.authService.signIn(body);
    return Utils.sendResponse(data, 'success');
  }

  @Post('/forgot-password')
  @ApiResponse({
    status: 201,
    description: 'Email sent successfully',
  })
  @ApiDataResponse(forgotPasswordResponseDto)
  @ApiResponse(SWAGGER_MESSAGES[400])
  @ApiResponse(SWAGGER_MESSAGES[500])
  @ApiOperation({
    summary: 'Forgot password for users',
  })
  async forgotPassword(@Body() body: forgotPasswordDto) {
    const data = await this.authService.forgotPassword(body);
    return Utils.sendResponse(data, 'success');
  }

  @Post('/reset-password')
  @ApiResponse({
    status: 201,
    description: 'Password reset successfully',
  })
  @ApiDataResponse(resetPasswordResponseDto)
  @ApiResponse(SWAGGER_MESSAGES[500])
  @ApiResponse(SWAGGER_MESSAGES[400])
  @ApiOperation({
    summary: 'Password reset with help reset link',
  })
  async resetPassword(@Body() body: resetPasswordDto) {
    const data = await this.authService.resetPassword(body);
    return Utils.sendResponse(data, 'success');
  }
}
