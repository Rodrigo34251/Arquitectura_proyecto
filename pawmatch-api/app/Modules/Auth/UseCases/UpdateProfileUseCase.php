<?php

namespace App\Modules\Auth\UseCases;

use App\Models\User;
use App\Modules\Auth\DTOs\UpdateProfileDTO;

class UpdateProfileUseCase
{
    public function execute(User $user, UpdateProfileDTO $dto): array
    {
        // Actualizar los datos del usuario
        $user->update($dto->toArray());

        return [
            'id' => $user->id,
            'nombre' => $user->nombre,
            'email' => $user->email,
            'telefono' => $user->telefono,
            'direccion' => $user->direccion,
            'rol' => $user->rol,
        ];
    }
}
