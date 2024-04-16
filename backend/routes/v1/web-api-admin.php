<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\Web\Admin\CustomerController;
use App\Http\Controllers\Api\Web\Admin\EmployeeController;
use App\Http\Controllers\Api\Web\Admin\MaterialController;
use App\Http\Controllers\Api\Web\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:' . UserRole::ADMIN->value])->group(function () {
    Route::middleware('access-location')->group(function () {
        Route::apiResource('employees', EmployeeController::class);
        Route::apiResource('customers', CustomerController::class);

        Route::apiResource('products', ProductController::class);
        Route::put('products/{uuid}/toggle-status', [ProductController::class, 'toggleStatus']);

        Route::apiResource('materials', MaterialController::class);
        Route::put('materials/{uuid}/toggle-status', [MaterialController::class, 'toggleStatus']);
    });
});
