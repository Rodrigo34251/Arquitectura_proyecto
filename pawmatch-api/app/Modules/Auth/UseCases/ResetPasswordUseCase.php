<?php

namespace App\Modules\Auth\UseCases;

use App\Modules\Auth\DTOs\ResetPasswordDTO;
use App\Modules\Auth\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ResetPasswordUseCase
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function execute(ResetPasswordDTO $dto): array
    {
        // Buscar el token en la base de datos
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $dto->email)
            ->where('token', hash('sha256', $dto->token))
            ->first();

        if (!$resetRecord) {
            throw ValidationException::withMessages([
                'token' => ['El token de restablecimiento es inválido o ha expirado.']
            ]);
        }

        // Verificar que el token no haya expirado 
        $createdAt = \Carbon\Carbon::parse($resetRecord->created_at);
        if ($createdAt->addMinutes(60)->isPast()) {
            // Eliminar token expirado
            DB::table('password_reset_tokens')->where('email', $dto->email)->delete();

            throw ValidationException::withMessages([
                'token' => ['El token de restablecimiento ha expirado. Por favor solicita uno nuevo.']
            ]);
        }

        // Buscar usuario
        $user = $this->userRepository->findByEmail($dto->email);

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Usuario no encontrado.']
            ]);
        }

        // Actualizar contraseña
        $user->update([
            'password' => Hash::make($dto->password)
        ]);

        // Eliminar el token usado
        DB::table('password_reset_tokens')->where('email', $dto->email)->delete();

        // Revocar todos los tokens de acceso existentes
        $user->tokens()->delete();

        return [
            'message' => 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.'
        ];
    }
}
