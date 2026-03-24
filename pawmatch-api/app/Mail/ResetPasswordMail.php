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

    public string $resetUrl;
    public string $userName;

    public function __construct(string $token, string $email, string $userName)
    {
        $this->userName = $userName;

        // Obtenemos la URL de tu frontend desde el .env
        $frontendUrl = config('app.frontend_url');

        // Construimos la URL final que verá el usuario en su bandeja de entrada
        $this->resetUrl = "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($email);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Restablecer Contraseña - PawMatch',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reset-password',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
