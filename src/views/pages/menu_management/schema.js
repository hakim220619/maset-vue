import { z } from 'zod';

const storeSchema = z.object(
    {
        name: z.string().min(1, { message: 'Name is required' }).max(1000)
        // order_list: z.in().min(1, { message: 'Address is required' }).max(1000)
        // validityType: z.number().min(1, { message: 'Validity Type is required' }).max(255)
    }
);

export { storeSchema };
