// schema.js
import { z } from 'zod';

export const storeSchema = z.object({
    rs_name: z.string().min(1, { message: 'Role name is required' }),
    rs_status: z.any().refine(val => val !== null && val !== undefined, {
        message: 'Status is required'
    })
});
