import { z } from 'zod';

const storeSchema = z.object({
    page_title: z.string().min(1, { message: 'Page title is required' }).max(255),
    service: z.string().min(1, { message: 'Service is required' }).max(255),
    database: z.string().min(1, { message: 'Database is required' }).max(255),
    table_name: z.string().min(1, { message: 'Table name is required' }).max(255)
});

export { storeSchema };
