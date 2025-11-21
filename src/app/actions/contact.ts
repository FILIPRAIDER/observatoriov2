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

    // Enviar email de bienvenida
    try {
      await resend.emails.send({
        from: "Observatorio de la Educación <onboarding@resend.dev>",
        to: [email],
        subject: "¡Bienvenido al Observatorio de la Educación!",
        react: NewsletterWelcomeEmail({ name }),
      });
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
      // No fallar la suscripción si el email falla
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

    // Enviar email al equipo del observatorio
    try {
      await resend.emails.send({
        from: "Formulario de Contacto <onboarding@resend.dev>",
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
    } catch (emailError) {
      console.error("Error enviando email al equipo:", emailError);
    }

    // Enviar email de confirmación al usuario
    try {
      await resend.emails.send({
        from: "Observatorio de la Educación <onboarding@resend.dev>",
        to: [data.email],
        subject: "Hemos recibido tu mensaje - Observatorio de la Educación",
        react: ContactConfirmationEmail({ name: data.name }),
      });
    } catch (emailError) {
      console.error("Error enviando email de confirmación:", emailError);
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
