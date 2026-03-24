<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Mascota;

class MascotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mascotas = [
            [
                'nombre' => 'Max',
                'especie' => 'PERRO',
                'raza' => 'Golden Retriever',
                'edad_aproximada' => 24,
                'sexo' => 'MACHO',
                'descripcion' => 'Perro muy amigable y juguetón, ideal para familias con niños.',
                'estado' => 'DISPONIBLE',
            ],
            [
                'nombre' => 'Luna',
                'especie' => 'GATO',
                'raza' => 'Persa',
                'edad_aproximada' => 18,
                'sexo' => 'HEMBRA',
                'descripcion' => 'Gata tranquila y cariñosa, perfecta para apartamentos.',
                'estado' => 'DISPONIBLE',
            ],
            [
                'nombre' => 'Rocky',
                'especie' => 'PERRO',
                'raza' => 'Mestizo',
                'edad_aproximada' => 36,
                'sexo' => 'MACHO',
                'descripcion' => 'Perro guardián muy leal y protector.',
                'estado' => 'DISPONIBLE',
            ],
            [
                'nombre' => 'Mia',
                'especie' => 'GATO',
                'raza' => 'Siamés',
                'edad_aproximada' => 12,
                'sexo' => 'HEMBRA',
                'descripcion' => 'Gata joven y muy activa.',
                'estado' => 'DISPONIBLE',
            ],
            [
                'nombre' => 'Bruno',
                'especie' => 'PERRO',
                'raza' => 'Labrador',
                'edad_aproximada' => 48,
                'sexo' => 'MACHO',
                'descripcion' => 'Perro adulto entrenado, perfecto para paseos.',
                'estado' => 'EN_PROCESO',
            ],
        ];

        foreach ($mascotas as $mascota) {
            Mascota::create($mascota);
        }

        Mascota::factory()->count(10)->create();
    }
}
