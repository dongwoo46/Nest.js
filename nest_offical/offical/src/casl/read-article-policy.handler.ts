import { AppAbility } from './casl-ability.factory/casl-ability.factory';
import { Article } from 'src/article/entities/article.entity';
import { IPolicyHandler } from './policy.handler';
import { Action } from 'src/enums/action.enum';

export class ReadArticlePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Article);
  }
}
