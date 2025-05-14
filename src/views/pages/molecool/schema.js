import { z } from 'zod';

const storeSchema = z.object(
    {
    type: z.string().min(1, { message: 'Type is required' }).max(255),
    ms_molecool_site_type_id: z.string().min(1, { message: 'Subtype is required' }).max(255),
    name: z.string().min(1, { message: 'Name is required' }).max(255),
    is_active: z.boolean().nullable()
}
);
 
export { storeSchema };
