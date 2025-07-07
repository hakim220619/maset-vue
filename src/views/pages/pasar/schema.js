// schema.js
import { z } from 'zod';

export const storeSchema = z.object({
    object_id: z.number({ required_error: 'Wajib pilih Object' }).min(1, 'Wajib pilih Object'),
    pembanding_id: z.array(z.number()).min(1, 'Wajib pilih minimal 1 Pembanding')
});
