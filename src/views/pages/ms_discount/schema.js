

import { z } from 'zod';

const storeSchema = z.object(
    {
        name: z.string().min(1, { message: 'Name is required' }).max(255),
        ms_discount_association_id: z.string().min(1, { message: 'Ms Discount Association Id is required' }).max(255),
        ms_discount_mode_id: z.string().min(1, { message: 'Ms Discount Mode Id is required' }).max(255),
        description: z.string().min(1, { message: 'Description is required' }).max(1000),
        discount_type: z.string().min(1, { message: 'Discount Type is required' }).max(1000),
        discount_value: z.string().min(1, { message: 'Discount Value is required' }).max(255),
        ms_reccurance_pattern_id: z.string().min(1, { message: 'Ms Reccurance Pattern Id is required' }).max(255),
        is_active: z.boolean().nullable(),
        start_date: z.string().min(1, { message: 'Start Date is required' }),
        end_date: z.string().min(1, { message: 'End Date is required' })
    }
);

export { storeSchema };

