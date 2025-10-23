<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\ProductController;
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
    
    Route::resource('products', ProductController::class)
    ->middleware(['verified'])
    ->names('products');

});





require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
