import { Controller, Headers, Param, Patch } from '@nestjs/common';
import { CalculatorService } from './calculator.service';

@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Patch('/:x/:y')
  gethello(
    @Headers('type-operation') header: string,
    @Param('x') x: number,
    @Param('y') y: number,
  ) {
    return this.calculatorService.getResult(header, x, y);
  }
}
