import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

interface PageProps {
  flash?: FlashMessages;
  [key: string]: unknown;
}

export function useFlashToast() {
  const { props } = usePage<PageProps>();

  useEffect(() => {
    const flash = props.flash;
    if (!flash) return;

    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
    if (flash.warning) toast.warning(flash.warning);
    if (flash.info) toast.info(flash.info);
  }, [props.flash]);
}
