<?php

namespace App\Http\Requests\Web\V1\Admin\Employee;

use App\Enums\Gender;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
            'user_id' => 'required',
            'username' => [
                'required',
                'alpha_dash',
                'unique:users,username,' . $this->user_id,
                'min:3',
            ],
            'email' => [
                'required',
                'unique:users,email,' . $this->user_id,
            ],
            'first_name' => 'required',
            'last_name' => 'nullable',
            'phone' => 'nullable',
            'password' => 'nullable|sometimes|confirmed',
            'image' => 'nullable|sometimes|image|max:2048',
            'is_active' => 'nullable',
            'employee_number' => 'nullable',
            'birthdate' => 'nullable|sometimes|date',
            'join_date' => 'nullable|sometimes|date',
            'gender' => 'required|in:' . implode(',', [Gender::MALE->value, Gender::FEMALE->value]),
        ];
    }
}
