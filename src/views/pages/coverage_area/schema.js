import { z } from 'zod';

const storeSchema = z.object(
    {
        cluster: z.string().min(1, { message: 'Cluster is required' }).max(255),
        cluster_code: z.number().min(1, { message: 'Cluster Id is required' }).int(),
        third_party_type: z.string().min(1, { message: 'Third Party Type is required' }).max(255),
        total_homepass: z.number().min(1, { message: 'Total Homepass is required' }).int(),
        hp_ok: z.number().min(1, { message: 'Hp Ok is required' }).int(),
        hp_idle: z.number().min(1, { message: 'Hp Idle is required' }).int(),
        total_hp: z.number().min(1, { message: 'Total Hp is required' }).int(),
        is_active: z.boolean().nullable(),
        subdistrict_id: z.string().min(1, { message: 'Subdistrict Id is required' }).max(255),
        service_id: z.string().min(1, { message: 'Service Id is required' }).max(255),
        site_category_id: z.string().min(1, { message: 'Site Category Id is required' }).max(255),
        ikr_region_id: z.string().min(1, { message: 'Ikr Region Id is required' }).max(255),
        fat_id: z.string().min(1, { message: 'Fat Id is required' }).max(255),
    }
);

export { storeSchema };
