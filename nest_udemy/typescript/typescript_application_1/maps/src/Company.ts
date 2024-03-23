import { faker } from '@faker-js/faker';

export class Company {
  companyName: string;
  catchPharase: string;
  location: {
    lat: number;
    lng: number;
  };

  constructor() {
    this.companyName = faker.company.name();
    this.catchPharase = faker.company.catchPhrase();
    this.location = {
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
    };
  }
}
