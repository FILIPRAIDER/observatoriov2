"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
  NewsletterWelcomeEmail,
  ContactMessageEmail,
  ContactConfirmationEmail,
} from "@/lib/email-templates";
import {
  newsletterLimiter,
  contactLimiter,
  getRemainingTime,
} from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "observatorio@ucc.edu.co";

interface NewsletterSubscribeResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function subscribeToNewsletter(
  name: string,
  email: string
): Promise<NewsletterSubscribeResult> {
  try {
    // Validaciones básicas
    if (!name || !email) {
      return {
        success: false,
        message: "Por favor completa todos los campos",
      };
    }

    if (!email.includes("@")) {
      return {
        success: false,
        message: "Por favor ingresa un correo válido",
      };
    }

    // Rate limiting por email
    const rateLimitCheck = newsletterLimiter.check(email.toLowerCase());
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        message: `Demasiados intentos. Intenta nuevamente en ${getRemainingTime(
          rateLimitCheck.resetTime
        )}.`,
      };
    }

    // Verificar si ya existe
    const existing = await prisma.newsletter_subscribers.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.subscribed) {
        return {
          success: false,
          message: "Ya hemos recibido tu solicitud anteriormente",
        };
      } else {
        // Reactivar solicitud
        await prisma.newsletter_subscribers.update({
          where: { email },
          data: { subscribed: true, name },
        });
      }
    } else {
      // Crear nueva solicitud
      await prisma.newsletter_subscribers.create({
        data: { name, email, subscribed: true },
      });
    }

    // Verificar que tenemos API key
    if (!process.env.RESEND_API_KEY) {
      console.error("[EMAIL ERROR] RESEND_API_KEY no está configurada");
    } else {
      console.log("[EMAIL] Intentando enviar emails...");
    }

    // Enviar email de confirmación al usuario
    try {
      const result = await resend.emails.send({
        from: "Observatorio de la Educación <observatorio@equipos.online>",
        to: [email],
        subject: "¡Gracias por contactarnos! - Observatorio de la Educación",
        react: NewsletterWelcomeEmail({ name }),
      });
      console.log("[EMAIL] Email de confirmación enviado:", result);
    } catch (emailError) {
      console.error("[EMAIL ERROR] Error enviando email de confirmación:", emailError);
      // No fallar la solicitud si el email falla
    }

    // Notificar al equipo del observatorio sobre la nueva solicitud
    try {
      const result = await resend.emails.send({
        from: "Sistema Observatorio <sistema@equipos.online>",
        to: [CONTACT_EMAIL],
        replyTo: email,
        subject: `Nueva solicitud de contacto de ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #17594A;">Nueva Solicitud de Contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #666; font-size: 14px;">Esta es una solicitud rápida desde el formulario de inicio.</p>
          </div>
        `,
      });
      console.log("[EMAIL] Notificación al equipo enviada:", result);
    } catch (emailError) {
      console.error("[EMAIL ERROR] Error enviando notificación al equipo:", emailError);
    }

    return {
      success: true,
      message: "¡Solicitud enviada! Nos pondremos en contacto contigo pronto.",
    };
  } catch (error) {
    console.error("Error en subscribeToNewsletter:", error);
    return {
      success: false,
      message: "Hubo un error al procesar tu solicitud. Intenta nuevamente.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

interface ContactMessageResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function sendContactMessage(
  data: ContactMessageData
): Promise<ContactMessageResult> {
  try {
    // Validaciones básicas
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        message: "Por favor completa todos los campos obligatorios",
      };
    }

    if (!data.email.includes("@")) {
      return {
        success: false,
        message: "Por favor ingresa un correo válido",
      };
    }

    // Rate limiting por email
    const rateLimitCheck = contactLimiter.check(data.email.toLowerCase());
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        message: `Demasiados intentos. Intenta nuevamente en ${getRemainingTime(
          rateLimitCheck.resetTime
        )}.`,
      };
    }

    // Guardar en base de datos
    await prisma.contact_messages.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        service: data.service || null,
        message: data.message,
        is_read: false,
      },
    });

    // Verificar que tenemos API key
    if (!process.env.RESEND_API_KEY) {
      console.error("[EMAIL ERROR] RESEND_API_KEY no está configurada");
    } else {
      console.log("[EMAIL] Intentando enviar emails...");
    }

    // Enviar email al equipo del observatorio
    try {
      const result = await resend.emails.send({
        from: "Formulario de Contacto <contacto@equipos.online>",
        to: [CONTACT_EMAIL],
        replyTo: data.email,
        subject: `Nuevo mensaje de contacto de ${data.name}`,
        react: ContactMessageEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
        }),
      });
      console.log("[EMAIL] Email al equipo enviado:", result);
    } catch (emailError) {
      console.error("[EMAIL ERROR] Error enviando email al equipo:", emailError);
    }

    // Enviar email de confirmación al usuario
    try {
      const result = await resend.emails.send({
        from: "Observatorio de la Educación <observatorio@equipos.online>",
        to: [data.email],
        subject: "Hemos recibido tu mensaje - Observatorio de la Educación",
        react: ContactConfirmationEmail({ name: data.name }),
      });
      console.log("[EMAIL] Email de confirmación enviado:", result);
    } catch (emailError) {
      console.error("[EMAIL ERROR] Error enviando email de confirmación:", emailError);
    }

    return {
      success: true,
      message:
        "¡Mensaje enviado correctamente! Te hemos enviado un correo de confirmación.",
    };
  } catch (error) {
    console.error("Error en sendContactMessage:", error);
    return {
      success: false,
      message: "Hubo un error al enviar tu mensaje. Intenta nuevamente.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
