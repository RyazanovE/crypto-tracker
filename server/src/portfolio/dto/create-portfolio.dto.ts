import { z } from 'zod';
import { IsNumber, IsString, Length } from 'class-validator';

export const CreatePortfolioSchema = z
  .object({
    name: z.string().min(1).max(20),
    userId: z.number().int().positive(),
  })
  .strict()
  .required();

export class CreatePortfolioDto {
  @IsString()
  @Length(1, 20, { message: 'error on length' })
  name: string;
  
  @IsNumber()
  userId: number;
}

export type CreatePortfolioDtoType = z.infer<typeof CreatePortfolioSchema>;
