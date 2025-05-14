

import { z } from 'zod';

const storeSchema = z.object(
    {
        home_code: z.string().min(1, { message: 'Home Code is required' }).max(255),
        site_code: z.string().min(1, { message: 'Site Code is required' }).max(255),
        fat_code: z.string().min(1, { message: 'Fat Code is required' }).max(255),
        zip_code: z.string().min(1, { message: 'Zip Code is required' }).max(255),
        sp_code: z.string().min(1, { message: 'Sp Code is required' }).max(255),
        address_home_no: z.string().min(1, { message: 'Address Home No is required' }).max(255),
        latitude: z.string().min(1, { message: 'Latitude is required' }).max(255),
        longitude: z.string().min(1, { message: 'Longitude is required' }).max(255),
        type_hp: z.string().min(1, { message: 'Type Hp is required' }).max(255),
        address_street_id: z.string().min(1, { message: 'Address Street Id is required' }).max(255),
        status_id: z.string().min(1, { message: 'Status Id is required' }).max(255),
    }
);

export { storeSchema };

