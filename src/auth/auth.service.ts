import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as Random from 'randomstring';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { signUpDto } from './dto/signUp.dto';
import { signInDto } from './dto/signIn.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { verifyAccountDto } from './dto/verifyAccount.dto';
import { Bcrypt } from '../utils/bcrypt';
import { Utils } from '../utils/utilFunctions';
import { MESSAGES } from '../utils/messages';
import { User } from '../model/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(body: signUpDto) {
    const user = await this.repo.findOne({ where: { email: body.email } });
    if (!user) {
      const user = await this.repo.create({
        email: body.email,
        first_name: body.firstName,
        last_name: body.lastName,
      });
      user.password = await Bcrypt.encryptPassword(body.password);
      user.is_active = 0;
      user.otp = Utils.generateOtp();

      //TODO: share otp via email

      const data = await this.repo.save(user);
      return AuthService.getUserInfo(data);
    } else if (!user.is_active) {
      throw new HttpException(MESSAGES.USER_INACTIVE, HttpStatus.BAD_REQUEST);
    } else {
      return await this.signIn(body);
    }
  }

  async signIn(body: signInDto) {
    const { email, password } = body;
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    } else if (user.is_active) {
      const isMatched = await Bcrypt.comparePassword(password, user.password);
      if (isMatched) {
        return {
          ...AuthService.getUserInfo(user),
          token: await this.jwtService.signAsync({
            email: user.email,
            id: user.id,
          }),
        };
      } else {
        throw new HttpException(
          MESSAGES.INVALID_CREDENTIALS,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(MESSAGES.USER_INACTIVE, HttpStatus.UNAUTHORIZED);
    }
  }

  async forgotPassword(body: forgotPasswordDto) {
    const { email } = body;

    const user = await this.repo.findOne({ where: { email } });

    if (user) {
      //TODO: send the random string to the user via email and remove resetLink from response
      const resetLink = Random.generate(12);
      const date = moment().add(1, 'day').utc();
      await this.repo.update(
        { id: user.id },
        { reset_token: resetLink, reset_expiry_time: date },
      );
      return { resetLink };
    }
  }

  async resetPassword(body: resetPasswordDto) {
    const { token, password } = body;
    const user = await this.repo.findOne({
      where: {
        reset_token: token,
      },
    });
    const compareDate = moment().utc().unix();
    if (user && user.reset_expiry_time) {
      if (compareDate > moment(user.reset_expiry_time).utc().unix()) {
        throw new HttpException(
          MESSAGES.RESET_LINK_EXPIRED,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const hash = await Bcrypt.encryptPassword(password);
        await this.repo.update(
          { id: user.id },
          {
            password: hash,
            reset_expiry_time: null,
            reset_token: null,
          },
        );
        return { email: user.email };
      }
    }
  }

  async verifyAccount(body: verifyAccountDto) {
    const { email, otp } = body;
    const user = await this.repo.findOne({ where: { email } });
    if (user && user.otp === Number(otp)) {
      await this.repo.update({ id: user.id }, { is_active: 1, otp: null });
      return {
        token: await this.jwtService.signAsync({
          email: user.email,
          id: user.id,
        }),
      };
    } else {
      throw new HttpException(MESSAGES.INVALID_OTP, HttpStatus.BAD_REQUEST);
    }
  }

  static getUserInfo(user) {
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      is_active: user.is_active,
      otp: user.otp,
    };
  }
}
