<?php

namespace App\Http\Controllers\Api\Web\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Web\V1\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use Exception;
use Illuminate\Validation\UnauthorizedException;

class AuthController extends Controller
{
    /**
     * Authentication service.
     *
     * @var \App\Services\V1\Auth\AuthService
     */
    protected AuthService $authService;

    /**
     * Create a new controller instance.
     *
     * @param  \App\Services\V1\Auth\AuthService  $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Attempt login the user and retrieves the token.
     *
     * @param  \App\Http\Requests\Web\V1\Admin\LoginRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        try {
            return ResponseHelper::data($this->authService->login($request->validated()));
        } catch (UnauthorizedException $e) {
            return ResponseHelper::unauthorized($e->getMessage());
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Get the current login user profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserProfile()
    {
        try {
            return ResponseHelper::data($this->authService->getUserProfile());
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }
}
