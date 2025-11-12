import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from './ui/input';

interface Props {
    colorId: number;
}

export const uploadSchema = z.object({
    images: z
        .instanceof(File)
        .array()
        .nonempty('Please select at least one image')
        .refine(
            (files) => files.every((file) => file.type.startsWith('image/')),
            'Only file images allowed (jpeg, png, etc.)',
        ),
});

export type ImageFormData = z.infer<typeof uploadSchema>;

export default function ImageUploadForm({ colorId }: Props) {
    const [loading, setLoading] = useState(false);

    const form = useForm<ImageFormData>({
        resolver: zodResolver(uploadSchema),
        defaultValues: {
            images: [],
        },
    });

    function handleUploadImage(values: ImageFormData) {
        setLoading(true);

        const formData = new FormData();
        values.images.forEach((file) => formData.append('images[]', file));

        router.post(`/products/product-colors/${colorId}/images`, formData, {
            forceFormData: true, // Asegura que se envíe como FormData
            onSuccess: () => {
                setLoading(false);
                window.location.reload();
                console.log('Imágenes subidas correctamente');
            },
            onError: (errors) => {
                setLoading(false);
                Object.entries(errors).forEach(([key, value]) => {
                    form.setError(key as keyof ImageFormData, {
                        message: value as string,
                    });
                });
            },
        });
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleUploadImage)}
                className="flex items-center gap-4"
            >
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = e.target.files
                                            ? Array.from(e.target.files)
                                            : [];
                                        field.onChange(files);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? 'Working...' : 'Upload images'}
                </Button>
            </form>
        </Form>
    );
}
