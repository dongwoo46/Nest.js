import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AppAbility,
  CaslAbilityFactory,
} from './casl-ability.factory/casl-ability.factory';
import { Reflector } from '@nestjs/core';
import { PolicyHandler } from './policy.hander';
import { CHECK_POLICIES_KEY } from './check.policies';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly usersService: UsersService, // UsersService를 주입받습니다.
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    console.log(user);

    const nowUser = await this.usersService.findOneByEmail(user.email);

    if (!nowUser || !nowUser.role) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const ability = this.caslAbilityFactory.createForUser(nowUser);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
