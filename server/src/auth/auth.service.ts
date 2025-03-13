import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private UserService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.UserService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    return {id: user.id};
  }
}
