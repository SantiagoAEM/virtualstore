import { useEffect } from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { generateSlug } from '@/lib/utils';

export function useSlugGenerator<T extends FieldValues>(
  form: UseFormReturn<T>,
  nameField: Path<T> = 'name' as Path<T>,
  slugField: Path<T> = 'slug' as Path<T>
) {
  const watchName = form.watch(nameField);

  useEffect(() => {
    if (watchName && typeof watchName === 'string') {
      form.setValue(slugField, generateSlug(watchName) as T[Path<T>]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchName]);
}