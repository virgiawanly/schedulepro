<?php

namespace App\Services\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\UnauthorizedException;

class AuthService
{
    /**
     * Attempt login the user and retrieves the token.
     *
     * @param  array  $payload
     * @return array
     * @throws \App\Exceptions\UnauthorizedException
     * @throws \Exception
     */
    public function login(array $payload)
    {
        $usernameOrEmail = $payload['username_or_email'] ?? null;
        $password = $payload['password'] ?? null;

        if (!$usernameOrEmail || !$password) {
            throw new UnauthorizedException('The username/email or password is incorrect.');
        }

        $user = User::where(function ($query) use ($usernameOrEmail) {
            $query->where('username', $usernameOrEmail)
                ->orWhere('email', $usernameOrEmail);
        })->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw new UnauthorizedException('The username/email or password is incorrect.');
        }

        if (!$user->is_active) {
            if ($user->role === UserRole::ADMIN->value) {
                throw new UnauthorizedException('Your account has been deactivated. Please contact our customer service for further information.');
            } else {
                throw new UnauthorizedException('Your account has been deactivated. Please contact your administrator for more information.');
            }
        }

        return [
            'user' => $user,
            'token' => $user->createToken('API_TOKEN')->plainTextToken,
        ];
    }

    /**
     * Get the current login user profile.
     *
     * @return \App\Models\User
     */
    public function getUserProfile()
    {
        return auth()->user();
    }
}
