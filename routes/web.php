<?php

use App\Http\Controllers\Admin\DeparmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('home');
})->name('home');



Route::middleware(['auth', 'role:Admin'])->group(function () {

    Route::get('/dashboard',function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('deparment', DeparmentController::class)
    ->middleware(['verified']);

});






require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
