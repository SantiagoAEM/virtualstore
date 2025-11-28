import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type image = {
    id: number;
    thumbnail: string;
    url: string;
    is_main: boolean;
};

export type ProductVariation = {
    id: number;
    slug: string;
    name: string;
    type: string;
    code: string;
    price: number;
    quantity: number;
    images: image[];
};

export type Product = {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    quantity: number;
    price: number;
    image: string;
    images: image[];
    user:{
        id:number;
        name:string;
    };
    department:{
        id:number;
        name:string;
    };
    variations: ProductVariation[];

};
    

export type PaginationProps<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};