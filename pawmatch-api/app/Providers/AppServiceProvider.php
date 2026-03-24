<?php

namespace App\Providers;

use App\Models\Mascota;
use App\Models\SolicitudAdopcion;
use App\Policies\MascotaPolicy;
use App\Policies\SolicitudAdopcionPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;



class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Rate limiting para la API general
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Rate limiting estricto para login 
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Rate limiting para registro
        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        // Rate limiting para forgot password
        RateLimiter::for('forgot-password', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });

        // Implementación de policies
        Gate::policy(Mascota::class, MascotaPolicy::class);
        Gate::policy(SolicitudAdopcion::class, SolicitudAdopcionPolicy::class);
    }
}
