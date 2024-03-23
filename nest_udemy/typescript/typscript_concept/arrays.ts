const carMakers: string[] = ['ford', 'toyota', 'chevy'];
const carMakers2 = ['chevy', 'hyundae'];
const dates = [new Date(), new Date()];

const carsByMake: string[][] = [];

const car = carMakers[0];
const myCar = carMakers.pop();

//prevent incompatible values
carMakers.push(100);

//help with 'map'
carMakers.map((car: string): string => {
  return car.toUpperCase();
});

//Flexible types
const importantDates: (Date | string)[] = [new Date(), '2030-20-10'];
importantDates.push('2030-10-10');
importantDates.push(new Date());
