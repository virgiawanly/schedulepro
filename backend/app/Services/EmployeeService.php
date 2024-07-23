<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Repositories\EmployeeRepository;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmployeeService
{
    /**
     * Employee repository instance.
     *
     * @var \App\Repositories\EmployeeRepository
     */
    protected EmployeeRepository $employeeRepository;

    /**
     * User repository instance.
     *
     * @var \App\Repositories\UserRepository
     */
    protected UserRepository $userRepository;

    /**
     * Create a new service instance.
     *
     * @param  \App\Repositories\EmployeeRepository  $employeeRepository
     * @param  \App\Repositories\UserRepository  $userRepository
     * @return void
     */
    public function __construct(EmployeeRepository $employeeRepository, UserRepository $userRepository)
    {
        $this->employeeRepository = $employeeRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Create a new employee and its user account.
     *
     * @param  array  $payload
     * @param  \Illuminate\Http\Request $request
     * @return \App\Models\User
     */
    public function saveEmployeeAndUser(array $payload, Request $request)
    {
        try {
            DB::beginTransaction();

            $userPayload = [
                'username' => $payload['username'] ?? null,
                'first_name' => $payload['first_name'] ?? null,
                'last_name' => $payload['last_name'] ?? null,
                'email' => $payload['email'] ?? null,
                'phone' => $payload['phone'] ?? null,
                'address' => $payload['address'] ?? null,
                'password' => !empty($payload['password']) ? bcrypt($payload['password']) : null,
                'birthdate' => $payload['birthdate'] ?? null,
                'company_id' => auth()->user()->company_id,
                'is_active' => $payload['is_active'] ?? true,
                'gender' => $payload['gender'] ?? null,
                'role' => UserRole::EMPLOYEE->value,
            ];

            if ($request->hasFile('image')) {
                $userPayload['image'] = $request->file('image')->store('users');
            }

            $user = $this->userRepository->save($userPayload);

            $employeePayload = [
                'user_id' => $user->id,
                'company_id' => $user->company_id,
                'location_id' => $request->header('Location-Id') ?? null,
                'employee_number' => $payload['employee_number'] ?? null,
                'join_date' => $payload['join_date'] ?? null,
            ];

            $employee = $this->employeeRepository->save($employeePayload);
            $employee->user = $user;

            DB::commit();
            return $employee;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an employee and its user account.
     *
     * @param  string $uuid
     * @param  array  $payload
     * @param  \Illuminate\Http\Request $request
     * @return \App\Models\User
     */
    public function updateEmployeeAndUser(string $uuid, array $payload, Request $request)
    {
        try {
            DB::beginTransaction();

            $employee = $this->employeeRepository->findByUuid($uuid);
            $user = $this->userRepository->find($employee->user_id);

            $userPayload = [
                'name' => $payload['name'] ?? $user->name,
                'email' => $payload['email'] ?? $user->email,
                'username' => $payload['username'] ?? $user->username,
                'phone' => $payload['phone'] ?? $user->phone,
                'address' => $payload['address'] ?? $user->address,
                'gender' => $payload['gender'] ?? null,
                'is_active' => $payload['is_active'] ?? $user->is_active,
                'birthdate' => $payload['birthdate'] ?? null,
            ];

            if ($request->hasFile('image')) {
                $userPayload['image'] = $request->file('image')->store('users');
            } else if($request->has('is_image_removed') && $request->is_image_removed) {
                $userPayload['image'] = null;
            }

            if ($request->has('password')) {
                $userPayload['password'] = bcrypt($payload['password']);
            }

            $user->update($userPayload);

            $employeePayload = [
                'employee_number' => $payload['employee_number'] ?? null,
                'join_date' => $payload['join_date'] ?? null,
            ];

            $employee->update($employeePayload);
            $employee->user = $user;

            DB::commit();
            return $employee;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete an employee and its user account.
     *
     * @param  string  $uuid
     * @return bool
     */
    public function deleteEmployeeAndUser(string $uuid)
    {
        try {
            DB::beginTransaction();

            $employee = $this->employeeRepository->findByUuid($uuid);
            $this->employeeRepository->delete($employee->id);
            $this->userRepository->delete($employee->user_id);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
