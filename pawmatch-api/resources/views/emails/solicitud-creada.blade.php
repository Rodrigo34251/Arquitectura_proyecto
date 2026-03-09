<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .mascota { background-color: white; padding: 15px; margin: 15px 0; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐾 PawMatch</h1>
        </div>
        <div class="content">
            <h2>¡Hola {{ $solicitud->user->nombre }}!</h2>
            <p>Hemos recibido tu solicitud de adopción para:</p>
            
            <div class="mascota">
                <h3>{{ $solicitud->mascota->nombre }}</h3>
                <p><strong>Especie:</strong> {{ $solicitud->mascota->especie }}</p>
                <p><strong>Raza:</strong> {{ $solicitud->mascota->raza ?? 'Mestizo' }}</p>
                <p><strong>Edad aproximada:</strong> {{ $solicitud->mascota->edad_aproximada ?? 'Desconocida' }} meses</p>
            </div>

            <p><strong>Estado actual:</strong> Pendiente de revisión</p>
            
            @if($solicitud->comentarios_adoptante)
                <p><strong>Tus comentarios:</strong></p>
                <p style="font-style: italic;">"{{ $solicitud->comentarios_adoptante }}"</p>
            @endif

            <p>Nuestro equipo revisará tu solicitud y te notificaremos sobre el resultado pronto.</p>
            <p>Gracias por tu interés en adoptar. ¡Esperamos poder ayudarte a encontrar tu compañero perfecto!</p>
        </div>
        <div class="footer">
            <p>Este es un correo automático de PawMatch. Por favor no respondas a este mensaje.</p>
            <p>&copy; 2026 PawMatch - Sistema de Adopción de Mascotas</p>
        </div>
    </div>
</body>
</html>