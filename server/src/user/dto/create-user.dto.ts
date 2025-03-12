import { z } from 'zod';
import { IsString, Length } from 'class-validator';

export const CreateUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict()
  .required();

export class CreateUserDto {
  @IsString()
  @Length(6, undefined, { message: 'error on length' })
  email: string;

  @IsString()
  password: string;
}

export type CreateUserDtoType = z.infer<typeof CreateUserSchema>;
