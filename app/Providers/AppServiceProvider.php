<?php

namespace App\Providers;

use App\Services\CartService;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CartService::class, function () {
            return new CartService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
        'flash' => function () {
            return [
                'success' => session('success'),
                'error' => session('error'),
            ];
        },
    ]);
    }
}
