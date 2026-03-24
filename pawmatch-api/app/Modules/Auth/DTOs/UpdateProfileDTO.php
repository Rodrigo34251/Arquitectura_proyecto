<?php

namespace App\Modules\Auth\DTOs;

class UpdateProfileDTO
{
    public function __construct(
        public readonly ?string $nombre = null,
        public readonly ?string $telefono = null,
        public readonly ?string $direccion = null
    ) {}

    // Form request para actualizar el perfil de usuario
    public static function fromRequest(array $data): self
    {
        return new self(
            nombre: $data['nombre'] ?? null,
            telefono: $data['telefono'] ?? null,
            direccion: $data['direccion'] ?? null
        );
    }

    // Devolver los datos en un array
    public function toArray(): array
    {
        return array_filter([
            'nombre' => $this->nombre,
            'telefono' => $this->telefono,
            'direccion' => $this->direccion,
        ], fn($value) => $value !== null);
    }
}
