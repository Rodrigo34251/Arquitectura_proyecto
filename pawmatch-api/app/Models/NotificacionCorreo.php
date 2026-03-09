<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificacionCorreo extends Model
{
    use HasFactory;

    protected $table = 'notificaciones_correo';

    protected $fillable = [
        'tipo',
        'destinatario_email',
        'solicitud_id',
        'estado_envio',
        'mensaje_error',
        'fecha_envio',
    ];

    protected $casts = [
        'fecha_envio' => 'datetime',
    ];

    public function solicitud()
    {
        return $this->belongsTo(SolicitudAdopcion::class, 'solicitud_id');
    }
}