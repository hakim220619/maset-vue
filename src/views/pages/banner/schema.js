import { z } from 'zod';

const storeSchema = z.object(
    {
    title: z.string().min(1, { message: 'Title is required' }).max(255),
    icon: z.string().min(1, { message: 'Icon is required' }).max(255),
    description: z.string().min(1, { message: 'Description is required' }).max(1000),
    start_date: z.string().min(1, { message: 'Start Date is required' }),
    end_date: z.string().min(1, { message: 'End Date is required' }),
    file: z.string().min(1, { message: 'File is required' }).max(255),
    color: z.string().min(1, { message: 'Color is required' }).max(1000),
    days: z.string().min(1, { message: 'Days is required' }).max(1000),
    link_url: z.string().min(1, { message: 'Link URL is required' }).max(255),
    is_active: z.boolean().nullable(),
    is_only_intranet: z.boolean().nullable(),
    is_mailing: z.boolean().nullable(),
    is_special_case: z.boolean().nullable(),
    timing_day_start: z.string().min(1, { message: 'Timing Day Start is required' }),
    timing_day_end: z.string().min(1, { message: 'Timing Day End is required' }),
    placement: z.string().min(1, { message: 'Placement is required' }).max(255)
}
);

export { storeSchema };
