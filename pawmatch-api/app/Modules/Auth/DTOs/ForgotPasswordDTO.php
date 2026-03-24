<?php

namespace App\Modules\Auth\DTOs;

use Illuminate\Support\Arr;

class ForgotPasswordDTO 
{
    public function __construct(
        public readonly string $email
    ){}

    public static function fromRequest(array $data): self 
    {
        // Retornar el email con la petición
        return new self(
            email: $data['email'] 
        );
    }
}