<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Frontend\ProductResourceController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductVariationController;
use App\Http\Resources\ProductDetailResource;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



/* Route::get('/', function () {
    return Inertia::render('home');
})->name('home');  */

Route::get('/', [ProductResourceController::class, 'home'])
    ->name('home');
Route::get('/product/{product:slug}', [ProductResourceController::class, 'show'])
    ->name('product.show');


Route::middleware(['auth', 'role:Admin'])->group(function () {

    Route::get('/dashboard',function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('department', DepartmentController::class)
    ->middleware(['verified'])
    ->names('department');

    Route::resource('categories', CategoryController::class)
    ->middleware(['verified'])
    ->names('categories');

  

});

Route::middleware(['auth', 'role:Vendor|Admin'])->group(function () {

       // Variaciones (color, tamaño, estilo, tipo)
        Route::post('/products/{product}/variations', [ProductVariationController::class, 'store'])
            ->name('products.variations.store');

        Route::put('/products/variations/{variation}', [ProductVariationController::class, 'update']);

        Route::delete('/products/variations/{variation}', [ProductVariationController::class, 'destroy'])
            ->name('products.variations.destroy');

        //  Imágenes de variaciones de productos
        Route::post('/products/variations/{variation}/images', [ProductImageController::class, 'upload'])
            ->name('products.variations.images.upload');

        Route::delete('/products/images/{image}', [ProductImageController::class, 'destroy'])
            ->name('products.images.destroy');

        Route::post('/products/product-images/{image}/set-main', [ProductImageController::class, 'setMainImage'])
            ->name('products.images.set-main');
            
            

    Route::resource('products', ProductController::class)
    ->middleware(['verified'])
    ->names('products');

});

/*  */





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
