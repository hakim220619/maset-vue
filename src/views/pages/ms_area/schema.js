import { z } from 'zod';

const storeSchema = z.object(
    {
    name: z.string().min(1, { message: 'Name is required' }).max(255),
    is_active: z.boolean().nullable()
}
);

export { storeSchema };
