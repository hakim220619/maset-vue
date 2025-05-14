

import { z } from 'zod';

const storeSchema = z.object(
    {
        name: z.string().min(1, { message: 'name is required' }).max(255),
        description: z.string().min(1, { message: 'description is required' }).max(1000),
        ms_ledger_code_id: z.number().min(1, { message: 'ms_ledger_code_id is required' }).int()
    }
);

export { storeSchema };

