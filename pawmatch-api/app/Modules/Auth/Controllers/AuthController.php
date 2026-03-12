<?php

namespace App\Modules\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Auth\DTOs\LoginUserDTO;
use App\Modules\Auth\DTOs\RegisterUserDTO;
use App\Modules\Auth\UseCases\LoginUserUseCase;
use App\Modules\Auth\UseCases\RegisterUserUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Modules\Auth\UseCases\ForgotPasswordUseCase;
use App\Modules\Auth\UseCases\ResetPasswordUseCase;
use App\Modules\Auth\DTOs\ForgotPasswordDTO;
use App\Modules\Auth\DTOs\ResetPasswordDTO;

class AuthController extends Controller
{
    // Instancia de los use cases
    public function __construct(
        private RegisterUserUseCase $registerUserUseCase,
        private LoginUserUseCase $loginUserUseCase,
        private ForgotPasswordUseCase $forgotPasswordUseCase,
        private ResetPasswordUseCase $resetPasswordUseCase
    ) {}

    /**
     * Registrar un usuario
     */

    public function register(Request $request): JsonResponse
    {
        try {
            // Crear request validando los datos
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:8|confirmed',
                'telefono' => 'nullable|string|max:20',
                'direccion' => 'nullable|string',
                'rol' => 'nullable|in:USUARIO,ADMINISTRADOR'
            ]);

            // Llamar al dto para encapsular los datos y mandar la request para el use case y transformarlo en un objeto
            $dto = RegisterUserDTO::fromRequest($validated);
            // Llamar al use case para crear el usuario
            $result = $this->registerUserUseCase->execute($dto);

            // Si el usuario se creó correctamente, devolver una respuesta con el mensaje y el objeto creado
            return response()->json([
                'message' => 'Usuario registrado exitosamente',
                'data' => $result
            ], 201);
        }
        // Si el usuario no se creó correctamente, devolver una respuesta con el mensaje de error
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } // Si ocurre algún error, devolver una respuesta con el mensaje de error
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al registrar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Iniciar sesión
     */
    public function login(Request $request): JsonResponse
    {
        try {
            // Crear request validando los datos
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);
            // Llamar al dto para encapsular los datos y mandar la request para el use case y transformarlo en un objeto
            $dto = LoginUserDTO::fromRequest($validated);
            // Llamar al use case para el inicio de sesión
            $result = $this->loginUserUseCase->execute($dto);

            // Devolver un mensaje de inicio de sesión y el objeto creado
            return response()->json([
                'message' => 'Inicio de sesión exitoso',
                'data' => $result
            ], 200);
        }
        // Si el usuario no inicio sesión correctamente, devolver una respuesta con el mensaje de error
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Credenciales incorrectas',
                'errors' => $e->errors()
            ], 401);
        }
        // Si ocurre algún error, devolver una respuesta con el mensaje de error
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al iniciar sesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cerrar sesión
     */

    public function logout(Request $request): JsonResponse
    {
        // Verificar el token actual del usuario y eliminarlo
        if ($request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        // Devolver un mensaje de cierre de sesión
        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    /**
     * Ver información del usuario
     */
    public function me(Request $request): JsonResponse
    {
        // Mandar la respuesta de los datos del usurio
        return response()->json([
            'data' => [
                'id' => $request->user()->id,
                'nombre' => $request->user()->nombre,
                'email' => $request->user()->email,
                'rol' => $request->user()->rol,
            ]
        ], 200);
    }

    /**
     * Solicitar restablecimiento de contraseña
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            // Validar los datos enviados en la petición
            $validated = $request->validate([
                'email' => 'required|string|email',
            ]);

            // Crear el dto para el use case
            $dto = ForgotPasswordDTO::fromRequest($validated);
            // Llamar al use case
            $result = $this->forgotPasswordUseCase->execute($dto);

            return response()->json($result, 200);
        } // Si ocurre algún error, devolver una respuesta con el mensaje de error
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al procesar la solicitud',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restablecer contraseña
     */
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            // Validar los datos enviados en la petición
            $validated = $request->validate([
                'token' => 'required|string',
                'email' => 'required|string|email',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Crear el dto para el use case
            $dto = ResetPasswordDTO::fromRequest($validated);
            //Mandar el resultado y ejecutar el use case
            $result = $this->resetPasswordUseCase->execute($dto);

            return response()->json($result, 200);
        } // Si ocurre algún error, devolver una respuesta con el mensaje de error
        catch (ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al restablecer contraseña',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
