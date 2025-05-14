import { z } from 'zod';

const storeSchema = z.object(
    {
        name: z.string().min(1, { message: 'Name is required' }).max(255),
        company_code: z.string().min(1, { message: 'Company Code is required' }).max(255),
        oracle_code: z.string().min(1, { message: 'Oracle Code is required' }).max(255),
        type: z.string().min(1, { message: 'Type is required' }).max(255),
        category_id: z.string().min(1, { message: 'Category Id is required' }).max(255)
    }
);

export { storeSchema };
