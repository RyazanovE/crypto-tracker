import { z } from 'zod';
import { IsEmail, IsString, Length } from 'class-validator';

export const CreateUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict()
  .required();

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export type CreateUserDtoType = z.infer<typeof CreateUserSchema>;
