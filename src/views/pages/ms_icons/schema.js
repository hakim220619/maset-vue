import { z } from 'zod';

const storeSchema = z.object(
    {
    icon_code: z.string().min(1, { message: 'Icon Code is required' }).max(255),
    is_active: z.boolean().nullable()
}
);

export { storeSchema };
