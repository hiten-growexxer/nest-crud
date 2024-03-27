import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Utils } from '../utils/utilFunctions';
import { AdminGuard } from '../guards/admin.guard';
import { ApiDataResponse } from '../decorators/swagger.decorator';
import { userListResponseDto } from './dto/response.dto';
import { SWAGGER_MESSAGES } from '../utils/messages';
@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiDataResponse(userListResponseDto)
  @ApiResponse(SWAGGER_MESSAGES[500])
  @ApiResponse(SWAGGER_MESSAGES[400])
  @ApiOperation({
    summary: 'List of users for admin',
  })
  @UseGuards(AdminGuard)
  async findAll() {
    const data = await this.userService.findAll();
    return Utils.sendResponse(data, 'success');
  }
}
