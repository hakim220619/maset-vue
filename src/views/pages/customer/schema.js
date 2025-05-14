import { z } from 'zod';

const storeSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(255),
    country_id: z.string().min(1, { message: 'Country is required' }).max(255),
    company: z.string().min(1, { message: 'Company is required' }).max(255),
    join_date: z.string().min(1, { message: 'Join Date is required' }),
    status: z.string().min(1, { message: 'Status is required' }).max(255),
    balance: z.number().min(1, { message: 'Balance is required' }).int(),
    is_active: z.boolean().nullable()
});

export { storeSchema };
