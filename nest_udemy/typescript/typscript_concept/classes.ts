class Vehicle {
  constructor(public color: string) {}

  protected honk(): void {
    console.log('chugga chugga');
  }
}

class Cars extends Vehicle {
  constructor(public wheels: number, color: string) {
    super(color);
  }
  private drive(): void {
    console.log('vroom');
  }
  startDrivingProcess(): void {
    this.drive();
    this.honk();
  }
}

const cars = new Cars(4, 'red');
cars.startDrivingProcess();
