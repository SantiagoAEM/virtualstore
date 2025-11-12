<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductColorController;
use App\Http\Controllers\ProductImageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('home');
})->name('home'); 

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
    Route::post('/products/product-images/{image}/set-main', [ProductImageController::class, 'setMainImage'])
    ->name('product-images.set-main');
    Route::post('/products/product-colors/{color}/images', [ProductImageController::class, 'upload'])->name('product.images.upload');
    Route::post('/products/product-images/{image}/main', [ProductImageController::class, 'setMainImage'])->name('product.images.main');
    Route::delete('/products/product-images/{image}', [ProductImageController::class, 'destroy'])->name('product.images.destroy');
 

    Route::post('/products/{product}/colors', [ProductColorController::class, 'store'])
        ->name('product.colors.store');
    Route::delete('products/product-colors/{color}', [ProductColorController::class, 'destroy'])
        ->name('product.colors.destroy');

    Route::resource('products', ProductController::class)
    ->middleware(['verified'])
    ->names('products');

});

/*  */





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
