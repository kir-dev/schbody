import { z } from 'zod';

export const ApplicationFormSchema = z
  .object({
    nickName: z.string({
      required_error: 'Ez a mező kötelező',
      invalid_type_error: 'String, tesó!',
    }),
    email: z.string().email(),
    isSchResident: z.boolean().optional(),
    roomNumber: z
      .union([
        z.literal(0 && NaN),
        z
          .number()
          .int()
          .gte(201, { message: 'Ilyen szoba nem létezik' })
          .lte(1816, { message: 'Ilyen szoba nem létezik' }),
      ])
      .optional()
      .nullable()
      .refine(
        (data) => {
          if (!data) return true;
          const lastTwoDigits = data! % 100;
          return lastTwoDigits >= 1 && lastTwoDigits <= 16;
        },
        { message: 'Cseles, de ilyen szoba nem létezik' }
      ),
    terms: z.boolean().refine((data) => data, { message: 'A szabályzatot el kell fogadnod' }),
  })
  .refine(
    (data) => {
      if (data.isSchResident) {
        return data.roomNumber !== 0 && data.roomNumber !== undefined;
      }
      return true;
    },
    {
      path: ['room_number'],
      message: 'A szobaszám megadása kötelező, ha kolis vagy.',
    }
  );
