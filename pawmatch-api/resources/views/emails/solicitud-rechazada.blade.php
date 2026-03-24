<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #EF4444;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 20px;
            background-color: #f9fafb;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
        }

        .mascota {
            background-color: white;
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
        }

        .motivo {
            background-color: #FEF2F2;
            padding: 10px;
            border-left: 4px solid #EF4444;
            margin: 15px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🐾 PawMatch</h1>
        </div>
        <div class="content">
            <h2>Hola {{ $solicitud->user->nombre }},</h2>
            <p>Lamentamos informarte que tu solicitud de adopción para <strong>{{ $solicitud->mascota->nombre }}</strong> no ha sido aprobada en esta ocasión.</p>

            @if($solicitud->motivo_rechazo)
            <div class="motivo">
                <p><strong>Motivo:</strong></p>
                <p>{{ $solicitud->motivo_rechazo }}</p>
            </div>
            @endif

            <p>Sabemos que esta noticia puede ser decepcionante, pero te animamos a:</p>
            <ul>
                <li>Explorar otras mascotas disponibles en nuestro catálogo</li>
                <li>Contactarnos si tienes dudas sobre los requisitos de adopción</li>
                <li>Intentar nuevamente en el futuro</li>
            </ul>

            <p>Gracias por tu interés en adoptar y por querer darle un hogar a una mascota que lo necesita.</p>
            <p>¡No te rindas! Hay muchas mascotas esperando por ti.</p>
        </div>
        <div class="footer">
            <p>Este es un correo automático de PawMatch. Por favor no respondas a este mensaje.</p>
            <p>&copy; 2026 PawMatch - Sistema de Adopción de Mascotas</p>
        </div>
    </div>
</body>

</html>