<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Company;
use App\Models\Employee;
use App\Models\User;
use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            DB::beginTransaction();

            $company = Company::create([
                'name' => 'SchedulePro',
                'slug' => 'schedulepro',
                'email' => 'hello@schedulepro.test',
                'phone' => '123456789',
                'website' => 'schedulepro.test',
                'logo' => null,
                'is_active' => 1,
            ]);

            $location = $company->locations()->create([
                'name' => 'Jakarta',
                'slug' => 'jakarta',
                'address' => 'Bintaro, Jakarta Selatan',
                'phone' => '123456789',
                'email' => 'hello@schedulepro.test',
                'is_active' => 1,
            ]);

            $company->locations()->create([
                'name' => 'Bandung',
                'slug' => 'bandung',
                'address' => 'Lembang, Bandung',
                'phone' => '123456789',
                'email' => 'hello@schedulepro.test',
                'is_active' => 1,
            ]);

            $admin = User::create([
                'company_id' => $company->id,
                'first_name' => 'Admin',
                'last_name' => 'Testing',
                'username' => 'admin',
                'email' => 'admin@schedulepro.test',
                'phone' => '123456789',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'image' => null,
                'role' => UserRole::ADMIN->value,
                'is_active' => 1,
                'last_login_at' => null,
            ]);

            $employeeUser = User::create([
                'company_id' => $company->id,
                'first_name' => 'Employee',
                'last_name' => 'Testing',
                'username' => 'employee',
                'email' => 'employee@schedulepro.test',
                'phone' => '123456789',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'image' => null,
                'role' => UserRole::EMPLOYEE->value,
                'is_active' => 1,
                'last_login_at' => null,
            ]);

            Employee::create([
                'user_id' => $employeeUser->id,
                'company_id' => $company->id,
                'location_id' => $location->id,
                'employee_number' => 'E-0001',
                'join_date' => now(),
            ]);

            $company->update([
                'owner_id' => $admin->id,
            ]);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
