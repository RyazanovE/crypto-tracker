import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class PortfolioValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown): unknown {
    const parsedValue = this.schema.safeParse(value);

    if (parsedValue.success) {
      return parsedValue.data;
    }

    throw new BadRequestException(parsedValue.error.format());
  }
}
