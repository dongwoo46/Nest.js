import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// 테스트에 설명을 추가하기 위해 describe 사용
describe('AuthService', () => {
  let service: AuthService; // 파일 최상위 범에 있어서 모든 함수에서 참조할 수 잇음
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers); //find는 비동기식이어야함, Promise를 반환해야함
      }, //Promise.resolve를 반환하는 함수
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService, // AuthService 인스턴스를 만들고 싶다고 DI 컨테이너에 알림
        // DI 컨테이너는 클래스를 살펴보고 클래스 의존성 이해, AuthService를 살펴볼 때 생성자 인수를 보고 이 클래스의 인수가 UsersService라는걸 파악
        // 이것이 provide의 첫번째 값, 두번째는 만약 UsersService의 카피를 요청하면 fakeUsersService 값 제공
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService); //DI 컨테이너가 생겨 서비스의 새 인스턴스 생성
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and ahsed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf'); // 해쉬처리되어서 password값과는 달라짐
    const [salt, hash] = user.password.split('.');
    // 솔트 및 해쉬 가 적용되었는지 확인
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // service의 signup을 두번 사용해서 에러 던지는지 확인
  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  // email이 없어 로그인 안됨
  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  // 잘못된 패스워드를 줬을 때
  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
