<?php

namespace App\Policies;

use App\Models\User;
use App\Models\SolicitudAdopcion;

class SolicitudAdopcionPolicy
{
    /**
     * Determinar si el usuario puede crear solicitudes de adopción
     * REGLA: Solo usuarios normales pueden adoptar, admins NO
     */
    public function create(User $user): bool
    {
        return $user->rol === 'USUARIO';
    }

    /**
     * Determinar si el usuario puede ver sus propias solicitudes
     */
    public function viewOwn(User $user, SolicitudAdopcion $solicitud): bool
    {
        return $solicitud->adoptante_id === $user->id;
    }

    /**
     * Ver una solicitud específica
     */
    public function view(User $user, SolicitudAdopcion $solicitud): bool
    {
        // El adoptante puede ver su propia solicitud
        // O un admin puede ver cualquier solicitud
        return $solicitud->adoptante_id === $user->id
            || $user->rol === 'ADMINISTRADOR';
    }

    /**
     * Determinar si el usuario puede ver todas las solicitudes
     */
    public function viewAny(User $user): bool
    {
        return $user->rol === 'ADMINISTRADOR';
    }

    /**
     * Determinar si el administrador puede aprobar/rechazar 
     */
    public function manage(User $user): bool
    {
        return $user->rol === 'ADMINISTRADOR';
    }
}
