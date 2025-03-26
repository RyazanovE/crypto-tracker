import { z } from 'zod';
import {  IsEnum, IsNumber, IsOptional, IsString, Length, isString } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export const CreateTransactionSchema = z
  .object({
    symbol: z.string().min(1).max(5),
    type: z.enum([TransactionType.BUY, TransactionType.SELL]),
    price: z.number(),
    amount: z.number(),
    date: z.string(),
    totalSpent: z.number().optional(),
  })
  .strict()
  .required();

  export class CreateTransactionDto {
    @IsString()
    @Length(1, 5, { message: 'Symbol must be between 1 and 5 characters long.' })
    symbol: string;
  
    @IsEnum(TransactionType, { message: 'Type must be either BUY or SELL.' })
    type: TransactionType;
  
    @IsNumber()
    price: number;
  
    @IsNumber()
    amount: number;
  
    @IsString()
    date: string;
  
    @IsOptional() 
    @IsNumber()
    totalSpent?: number;
  
    @IsNumber()
    userId: number;
  }

export type CreateTransactionDtoType = z.infer<typeof CreateTransactionSchema>;
