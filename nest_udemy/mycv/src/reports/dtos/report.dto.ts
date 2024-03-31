import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  approved: boolean;

  // 새로운 속성 추가 -> @Transform()사용
  // @Transform() 함수를 이용
  // report객체를 받아서 report 객채의 user의 id를 가져와서 보여주겟다 즉 obj는 report객체
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  // 원하는 값에 report 객체의 값을 매핑 시켜주는 것
  // {} 안의 id, email의 경우 자신이 이름을 정하는 것
  // @Transform(({ obj }) => ({ id: obj.user.id, email: obj.user.email }))
  // @Expose()
  // user: UserDto;
}
