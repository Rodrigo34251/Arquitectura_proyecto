<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        User::create([
            'nombre' => 'Admin PawMatch',
            'email' => 'admin@pawmatch.com',
            'password' => bcrypt('admin123'),
            'telefono' => '12345678',
            'direccion' => 'San Salvador, El Salvador',
            'rol' => 'ADMINISTRADOR',
            'email_verified_at' => now(),
        ]);

        
        User::create([
            'nombre' => 'Juan Pérez',
            'email' => 'juan@gmail.com',
            'password' => bcrypt('password123'),
            'telefono' => '11111111',
            'direccion' => 'Antiguo Cuscatlán',
            'rol' => 'USUARIO',
            'email_verified_at' => now(),
        ]);

        
        User::create([
            'nombre' => 'María García',
            'email' => 'maria@gmail.com',
            'password' => bcrypt('password123'),
            'telefono' => '22222222',
            'direccion' => 'Santa Tecla',
            'rol' => 'USUARIO',
            'email_verified_at' => now(),
        ]);

        
        User::factory()->count(5)->create();
    }
}
