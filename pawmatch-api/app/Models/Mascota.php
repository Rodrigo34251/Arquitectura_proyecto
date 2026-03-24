<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mascota extends Model
{
    use HasFactory, SoftDeletes;

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'nombre',
        'especie',
        'raza',
        'edad_aproximada',
        'sexo',
        'descripcion',
        'foto',       
        'estado'
    ];

    protected $casts = [
        'edad_aproximada' => 'integer',
    ];

    // Agregar foto_url como atributo virtual
    protected $appends = ['foto_url'];

    // Relaciones
    public function solicitudes()
    {
        return $this->hasMany(SolicitudAdopcion::class);
    }

    // Métodos helper
    public function isDisponible(): bool
    {
        return $this->estado === 'DISPONIBLE';
    }

    public function marcarComoEnProceso(): void
    {
        $this->update(['estado' => 'EN_PROCESO']);
    }

    public function marcarComoAdoptada(): void
    {
        $this->update(['estado' => 'ADOPTADA']);
    }

    // Accessor para generar la URL completa de la foto
    public function getFotoUrlAttribute(): ?string
    {
        // Si no hay foto guardada, retornar null
        if (!$this->foto) {
            return null;
        }

        // Si ya es una URL completa, devolverla tal cual
        if (filter_var($this->foto, FILTER_VALIDATE_URL)) {
            return $this->foto;
        }

        // Generar la URL completa usando la configuración de la app
        return config('app.url') . '/storage/' . $this->foto;
    }
}
