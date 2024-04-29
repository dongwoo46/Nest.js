import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Article } from 'src/article/entities/article.entity';
import { Action } from 'src/enums/action.enum';
import { User } from 'src/users/entities/user.entity';

type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    //'all'은 CASL에서 '모든 주체(any subject)'
    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    //사용자의 userId가 Article의 작성자인지 여부를 확인합니다. 즉, 사용자가 자신이 작성한 Article을 업데이트할 수 있습니다.
    can(Action.Update, Article, { authorId: user.userId });

    //코드는 사용자가 게시된 Article을 삭제할 수 없도록 정의
    cannot(Action.Delete, Article, { isPublished: true });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
