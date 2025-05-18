import { z } from 'zod';

export const storeSchema = z.object({
    role_name: z.string().min(1, { message: 'Role name is required' }),
    role_status: z.any().refine(val => val !== null && val !== undefined, {
        message: 'Status is required'
    })
});
