<?php

namespace Database\Seeders;

use App\Models\Mascota;
use App\Models\SolicitudAdopcion;
use App\Models\User;
use Illuminate\Database\Seeder;

class SolicitudSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $usuarios = User::where('rol', 'USUARIO')->get();
        $mascotas = Mascota::whereIn('estado', ['DISPONIBLE', 'EN_PROCESO'])->get();

        if ($usuarios->isEmpty() || $mascotas->isEmpty()) {
            return;
        }


        for ($i = 0; $i < 5; $i++) {
            $usuario = $usuarios->random();
            $mascota = $mascotas->random();


            $existe = SolicitudAdopcion::where('user_id', $usuario->id)
                ->where('mascota_id', $mascota->id)
                ->whereIn('estado', ['PENDIENTE', 'EN_REVISION'])
                ->exists();

            if (!$existe) {
                SolicitudAdopcion::create([
                    'user_id' => $usuario->id,
                    'mascota_id' => $mascota->id,
                    'estado' => fake()->randomElement(['PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA']),
                    'comentarios_adoptante' => fake()->sentence(10),
                    'motivo_rechazo' => fake()->boolean(30) ? fake()->sentence() : null,
                ]);
            }
        }
    }
}
