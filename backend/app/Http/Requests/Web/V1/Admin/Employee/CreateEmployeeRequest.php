<?php

namespace App\Http\Requests\Web\V1\Admin\Employee;

use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;

class CreateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required',
            'last_name' => 'nullable',
            'username' => 'required|alpha_dash|unique:users,username|min:3',
            'email' => 'required|unique:users,email',
            'phone' => 'nullable',
            'password' => 'required|confirmed',
            'image' => 'nullable|sometimes|image|max:2048',
            'is_active' => 'required|boolean',
            'employee_number' => 'nullable',
            'birthdate' => 'nullable|sometimes|date',
            'join_date' => 'nullable|sometimes|date',
            'gender' => 'required|in:' . implode(',', [Gender::MALE->value, Gender::FEMALE->value]),
        ];
    }
}
