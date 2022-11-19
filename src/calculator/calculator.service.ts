import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculatorService {
  getResult(operation: string, x: number, y: number) {
    switch (operation) {
      case 'add':
        return this.add(x, y);
      case 'substract':
        return this.substract(x, y);
      case 'multiply':
        return this.multiply(x, y);
      case 'divide':
        return this.divide(x, y);
      default:
        return 'Запрашиваемая математическая операция не найдена.';
    }
  }

  add(x: number, y: number): number {
    return x + y;
  }

  substract(x: number, y: number): number {
    return x - y;
  }

  multiply(x: number, y: number): number {
    return x * y;
  }

  divide(x: number, y: number): number {
    return x / y;
  }
}
