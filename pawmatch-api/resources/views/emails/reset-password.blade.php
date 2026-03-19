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
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 20px;
            background-color: #f9fafb;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
        }

        .warning {
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
            <h2>Hola {{ $userName }},</h2>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en PawMatch.</p>

            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

            <center>
                <a href="{{ $resetUrl }}" class="button">Restablecer Contraseña</a>
            </center>

            <div class="warning">
                <p><strong>Importante:</strong></p>
                <ul>
                    <li>Este enlace expirará en 60 minutos</li>
                    <li>Si no solicitaste este cambio, ignora este correo</li>
                    <li>Tu contraseña no se modificará hasta que ingreses una nueva</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>Este es un correo automático de PawMatch. Por favor no respondas a este mensaje.</p>
            <p>&copy; 2026 PawMatch - Sistema de Adopción de Mascotas</p>
        </div>
    </div>
</body>

</html>