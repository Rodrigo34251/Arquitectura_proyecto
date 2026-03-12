<?php

namespace App\Modules\Auth\UseCases;

use App\Mail\ResetPasswordMail;
use App\Modules\Auth\DTOs\ForgotPasswordDTO;
use App\Modules\Auth\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class ForgotPasswordUseCase
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function execute(ForgotPasswordDTO $dto): array
    {
        // Verificar que el usuario existe
        $user = $this->userRepository->findByEmail($dto->email);

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['No encontramos una cuenta con ese correo electrónico.']
            ]);
        }

        // Generar token único
        $token = Str::random(64);

        // Eliminar tokens anteriores del usuario
        DB::table('password_reset_tokens')
            ->where('email', $dto->email)
            ->delete();

        // Guardar nuevo token en la base de datos
        DB::table('password_reset_tokens')->insert([
            'email' => $dto->email,
            'token' => hash('sha256', $token), 
            'created_at' => now(),
        ]);

        // Generar URL de reset (este URL será en el frontend)
        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($dto->email);

        // Enviar email
        try {
            Mail::to($user->email)->send(new ResetPasswordMail($resetUrl, $user->nombre));
        } catch (\Exception $e) {
            \Log::error('Error al enviar email de reset password: ' . $e->getMessage());
        }

        return [
            'message' => 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.'
        ];
    }
}
