<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $resetUrl,
        public string $userName
    ) {}

    // Función para obtener el contenido del mail
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recuperar Contraseña - PawMatch',
        );
    }

    public function content(): Content
    {
        // Retornar la vista para resetear la contraseña
        return new Content(
            view: 'emails.reset-password',
        );
    }
}
