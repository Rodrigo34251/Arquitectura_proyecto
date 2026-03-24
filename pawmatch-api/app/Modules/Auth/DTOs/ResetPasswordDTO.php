<?php

namespace App\Modules\Auth\DTOs;

class ResetPasswordDTO
{
    public function __construct(
        public readonly string $token,
        public readonly string $email,
        public readonly string $password
    ) {}

    // Form request para restablecer la contraseña
    public static function fromRequest(array $data): self
    {
        // Retornar el token, email y password con la petición
        return new self(
            token: $data['token'],
            email: $data['email'],
            password: $data['password']
        );
    }
}
