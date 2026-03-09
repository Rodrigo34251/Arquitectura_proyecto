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
            background-color: #10B981;
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

        .success {
            color: #10B981;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>🎉 ¡Felicidades!</h1>
        </div>
        <div class="content">
            <h2>¡Hola {{ $solicitud->user->nombre }}!</h2>
            <p class="success">¡Tenemos excelentes noticias! Tu solicitud de adopción ha sido APROBADA.</p>

            <div class="mascota">
                <h3>{{ $solicitud->mascota->nombre }}</h3>
                <p><strong>Especie:</strong> {{ $solicitud->mascota->especie }}</p>
                <p><strong>Raza:</strong> {{ $solicitud->mascota->raza ?? 'Mestizo' }}</p>
            </div>

            <p><strong>Próximos pasos:</strong></p>
            <ol>
                <li>Nuestro equipo se pondrá en contacto contigo pronto para coordinar la entrega.</li>
                <li>Por favor, ten preparados los documentos de identificación necesarios.</li>
                <li>Prepara tu hogar para recibir a tu nuevo compañero.</li>
            </ol>

            <p>¡Estamos muy emocionados de que {{ $solicitud->mascota->nombre }} haya encontrado un hogar!</p>
            <p>Gracias por adoptar y dar una segunda oportunidad.</p>
        </div>
        <div class="footer">
            <p>Este es un correo automático de PawMatch. Por favor no respondas a este mensaje.</p>
            <p>&copy; 2026 PawMatch - Sistema de Adopción de Mascotas</p>
        </div>
    </div>
</body>

</html>