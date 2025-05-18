// schema.js
import { z } from 'zod';

export const storeSchema = z.object({
    ra_name: z.string().min(1, { message: 'Role name is required' }),
    ra_status: z.any().refine(val => val !== null && val !== undefined, {
        message: 'Status is required'
    })
});
