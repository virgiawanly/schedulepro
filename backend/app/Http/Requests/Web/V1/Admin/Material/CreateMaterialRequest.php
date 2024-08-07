<?php

namespace App\Http\Requests\Web\V1\Admin\Material;

use Illuminate\Foundation\Http\FormRequest;

class CreateMaterialRequest extends FormRequest
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
            'name' => 'required|max:255',
            'uom' => 'nullable|max:255',
            'description' => 'nullable',
            'price' => 'required|numeric|min:0',
            'is_active' => 'nullable|in:0,1,true,false',
            'image' => 'nullable|sometimes|image',
        ];
    }
}
