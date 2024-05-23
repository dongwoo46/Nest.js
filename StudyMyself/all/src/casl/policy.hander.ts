import { Action } from './actions.enum';
import { AppAbility } from './casl-ability.factory/casl-ability.factory';
import { Report } from 'src/reports/entities/report.entity';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

//@CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Report))
// 위의 내용을 아래의 클래스로 만들어 사용할 수 있게 해주는 코드
// @CheckPolicies(new ReadArticlePolicyHandler())
export class ReadArticlePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Report);
  }
}
