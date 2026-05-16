<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' =>'nullable|in:pending,ongoing,complete'
        ];
    }
    public function messages(): array
    {
        return [
            'title.required' => 'The task title is required.',
            'title.max' => 'The title may not be greater than 255 characters.',
            'status.in' => 'The selected status is invalid. Use: pending, ongoing, or complete.'
        ];
    }

}
