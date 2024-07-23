<?php

use App\Http\Controllers\Api\Web\Admin\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'getUserProfile']);
});

require_once __DIR__ . '/web-api-admin.php';
require_once __DIR__ . '/web-api-employee.php';
