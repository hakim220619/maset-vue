import { z } from 'zod';

const storeSchema = z.object({
    owner: z.string().min(1, { message: 'Owner is required' }).max(100),
    address: z.string().optional(), // text, bisa kosong
    contact: z.string().max(50).optional(),
    title: z.string().max(20).optional(),
    name: z.string().min(1, { message: 'Name is required' }).max(100),
    copyright: z.string().max(50).optional(),
    version: z.string().max(20).optional(),
    whatsapp_token: z.string().max(500).optional(),
    whatsapp_url: z.string().max(500).optional(),
});

export { storeSchema };
