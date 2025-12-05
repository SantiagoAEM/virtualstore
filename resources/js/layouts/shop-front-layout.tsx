import ShopFooter from '@/components/ShopFooter';
import ShopHeader from '@/components/ShopHeader';
import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

interface Props {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function ShopFrontLayout({ children, breadcrumbs }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <ShopHeader />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              {breadcrumbs.map((b, i) => (
                <li key={i} className="inline-flex items-center">
                  <Link href={b.href} className="hover:underline">
                    {b.title}
                  </Link>
                  {i < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      <main className="flex-1">{children}</main>

      <ShopFooter />
    </div>
  );
}