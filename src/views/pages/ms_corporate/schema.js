import { z } from 'zod';

const storeSchema = z.object(
    {
        ms_corporate_type_id: z.string().min(1, { message: 'Type is required' }).max(255),
        name: z.string().min(1, { message: 'Name is required' }).max(255),
        is_active: z.boolean().nullable()
    });

export { storeSchema };
