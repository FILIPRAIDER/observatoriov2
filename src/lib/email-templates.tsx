import * as React from 'react';

interface EmailTemplateProps {
  name: string;
}

export function NewsletterWelcomeEmail({
  name,
}: Readonly<EmailTemplateProps>) {
  return (
    <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style={{ 
      margin: 0, 
      padding: 0, 
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ backgroundColor: '#f9fafb', padding: '40px 20px' }}
      >
        <tr>
          <td align="center">
            <table
              width="600"
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Header con gradiente */}
              <tr>
                <td
                  style={{
                    background: 'linear-gradient(135deg, #17594A 0%, #059669 100%)',
                    padding: '40px 30px',
                    textAlign: 'center',
                  }}
                >
                  <h1 style={{ 
                    color: '#ffffff', 
                    margin: 0, 
                    fontSize: '28px',
                    fontWeight: '700'
                  }}>
                    ¡Bienvenido al Observatorio!
                  </h1>
                </td>
              </tr>

              {/* Contenido */}
              <tr>
                <td style={{ padding: '40px 30px' }}>
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: '#374151',
                    margin: '0 0 20px 0'
                  }}>
                    Hola <strong>{name}</strong>,
                  </p>
                  
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: '#374151',
                    margin: '0 0 20px 0'
                  }}>
                    ¡Gracias por tu interés en el <strong>Observatorio de la Educación en Córdoba</strong>! 
                    Hemos recibido tu información correctamente.
                  </p>

                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: '#374151',
                    margin: '0 0 20px 0'
                  }}>
                    Nuestro equipo se pondrá en contacto contigo pronto para ofrecerte estudios, 
                    diagnósticos y asesoría especializada para tu institución.
                  </p>

                  <div style={{
                    backgroundColor: '#f0fdf4',
                    borderLeft: '4px solid #17594A',
                    padding: '20px',
                    marginTop: '30px',
                    marginBottom: '30px',
                    borderRadius: '8px'
                  }}>
                    <p style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.6', 
                      color: '#065f46',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      📊 Mientras tanto, explora nuestros datos y análisis sobre educación en Córdoba
                    </p>
                  </div>

                  <table cellPadding="0" cellSpacing="0" style={{ margin: '30px auto' }}>
                    <tr>
                      <td
                        align="center"
                        style={{
                          backgroundColor: '#17594A',
                          borderRadius: '12px',
                          padding: '14px 32px',
                        }}
                      >
                        <a
                          href="https://observatoriov2.vercel.app"
                          style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'inline-block',
                          }}
                        >
                          Visitar el Observatorio
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              {/* Footer */}
              <tr>
                <td
                  style={{
                    backgroundColor: '#f9fafb',
                    padding: '30px',
                    textAlign: 'center',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '0 0 10px 0',
                    lineHeight: '1.5'
                  }}>
                    <strong>Observatorio de la Educación en Córdoba</strong><br />
                    Universidad Cooperativa de Colombia - Sede Montería
                  </p>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#9ca3af', 
                    margin: 0 
                  }}>
                    Este correo fue enviado porque solicitaste información a través de nuestro sitio web.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  );
}

interface ContactMessageEmailProps {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export function ContactMessageEmail({
  name,
  email,
  phone,
  service,
  message,
}: Readonly<ContactMessageEmailProps>) {
  return (
    <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style={{ 
      margin: 0, 
      padding: 0, 
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ backgroundColor: '#f9fafb', padding: '40px 20px' }}
      >
        <tr>
          <td align="center">
            <table
              width="600"
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Header */}
              <tr>
                <td
                  style={{
                    background: 'linear-gradient(135deg, #17594A 0%, #059669 100%)',
                    padding: '40px 30px',
                    textAlign: 'center',
                  }}
                >
                  <h1 style={{ 
                    color: '#ffffff', 
                    margin: 0, 
                    fontSize: '28px',
                    fontWeight: '700'
                  }}>
                    💬 Nuevo Mensaje de Contacto
                  </h1>
                </td>
              </tr>

              {/* Contenido */}
              <tr>
                <td style={{ padding: '40px 30px' }}>
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: '#374151',
                    margin: '0 0 30px 0'
                  }}>
                    Has recibido un nuevo mensaje desde el formulario de contacto:
                  </p>
                  
                  {/* Info del contacto */}
                  <table cellPadding="0" cellSpacing="0" style={{ width: '100%', marginBottom: '30px' }}>
                    <tr>
                      <td style={{ 
                        padding: '12px 20px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        marginBottom: '10px'
                      }}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                          <tr>
                            <td style={{ 
                              fontSize: '14px', 
                              color: '#6b7280',
                              fontWeight: '600',
                              paddingBottom: '4px'
                            }}>
                              👤 Nombre
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: '16px', color: '#111827' }}>
                              {name}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <tr><td style={{ height: '10px' }}></td></tr>
                    
                    <tr>
                      <td style={{ 
                        padding: '12px 20px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px'
                      }}>
                        <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                          <tr>
                            <td style={{ 
                              fontSize: '14px', 
                              color: '#6b7280',
                              fontWeight: '600',
                              paddingBottom: '4px'
                            }}>
                              📧 Correo electrónico
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: '16px', color: '#111827' }}>
                              <a href={`mailto:${email}`} style={{ color: '#17594A', textDecoration: 'none' }}>
                                {email}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    {phone ? (
                      <tr>
                        <td style={{ height: '10px' }}></td>
                      </tr>
                    ) : null}
                    {phone ? (
                      <tr>
                        <td style={{ 
                          padding: '12px 20px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px'
                        }}>
                          <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                            <tr>
                              <td style={{ 
                                fontSize: '14px', 
                                color: '#6b7280',
                                fontWeight: '600',
                                paddingBottom: '4px'
                              }}>
                                📱 Teléfono
                              </td>
                            </tr>
                            <tr>
                              <td style={{ fontSize: '16px', color: '#111827' }}>
                                {phone}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    ) : null}

                    {service ? (
                      <tr>
                        <td style={{ height: '10px' }}></td>
                      </tr>
                    ) : null}
                    {service ? (
                      <tr>
                        <td style={{ 
                          padding: '12px 20px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px'
                        }}>
                          <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                            <tr>
                              <td style={{ 
                                fontSize: '14px', 
                                color: '#6b7280',
                                fontWeight: '600',
                                paddingBottom: '4px'
                              }}>
                                🎯 Servicio de interés
                              </td>
                            </tr>
                            <tr>
                              <td style={{ fontSize: '16px', color: '#111827' }}>
                                {service}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    ) : null}
                  </table>

                  {/* Mensaje */}
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    borderLeft: '4px solid #17594A',
                    padding: '20px',
                    borderRadius: '8px',
                    marginTop: '20px'
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#065f46',
                      fontWeight: '600',
                      margin: '0 0 10px 0'
                    }}>
                      💬 Mensaje:
                    </p>
                    <p style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.6', 
                      color: '#047857',
                      margin: 0,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {message}
                    </p>
                  </div>

                  <table cellPadding="0" cellSpacing="0" style={{ margin: '30px auto' }}>
                    <tr>
                      <td
                        align="center"
                        style={{
                          backgroundColor: '#17594A',
                          borderRadius: '12px',
                          padding: '14px 32px',
                        }}
                      >
                        <a
                          href={`mailto:${email}`}
                          style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'inline-block',
                          }}
                        >
                          Responder a {name}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              {/* Footer */}
              <tr>
                <td
                  style={{
                    backgroundColor: '#f9fafb',
                    padding: '30px',
                    textAlign: 'center',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '0 0 10px 0',
                    lineHeight: '1.5'
                  }}>
                    <strong>Observatorio de la Educación en Córdoba</strong><br />
                    Sistema de gestión de contactos
                  </p>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#9ca3af', 
                    margin: 0 
                  }}>
                    Este mensaje fue enviado automáticamente desde el formulario de contacto.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  );
}

interface ContactConfirmationEmailProps {
  name: string;
}

export function ContactConfirmationEmail({
  name,
}: Readonly<ContactConfirmationEmailProps>) {
  return (
    <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style={{ 
      margin: 0, 
      padding: 0, 
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ backgroundColor: '#f9fafb', padding: '40px 20px' }}
      >
        <tr>
          <td align="center">
            <table
              width="600"
              cellPadding="0"
              cellSpacing="0"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Header */}
              <tr>
                <td
                  style={{
                    background: 'linear-gradient(135deg, #17594A 0%, #059669 100%)',
                    padding: '40px 30px',
                    textAlign: 'center',
                  }}
                >
                  <h1 style={{ 
                    color: '#ffffff', 
                    margin: 0, 
                    fontSize: '28px',
                    fontWeight: '700'
                  }}>
                    ✅ Mensaje Recibido
                  </h1>
                </td>
              </tr>

              {/* Contenido */}
              <tr>
                <td style={{ padding: '40px 30px' }}>
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: '#374151',
                    margin: '0 0 20px 0'
                  }}>
                    Hola <strong>{name}</strong>,
                  </p>
                  
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: '#374151',
                    margin: '0 0 20px 0'
                  }}>
                    ¡Gracias por contactarnos! Hemos recibido tu mensaje correctamente y nuestro equipo 
                    lo está revisando.
                  </p>

                  <div style={{
                    backgroundColor: '#f0fdf4',
                    borderLeft: '4px solid #17594A',
                    padding: '20px',
                    marginTop: '30px',
                    marginBottom: '30px',
                    borderRadius: '8px'
                  }}>
                    <p style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.6', 
                      color: '#065f46',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      ⏱️ Nos pondremos en contacto contigo en un plazo de <strong>24-48 horas</strong>
                    </p>
                  </div>

                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.6', 
                    color: '#374151',
                    margin: '0 0 20px 0'
                  }}>
                    Mientras tanto, te invitamos a explorar nuestros recursos y publicaciones sobre 
                    educación en el departamento de Córdoba.
                  </p>

                  <table cellPadding="0" cellSpacing="0" style={{ margin: '30px auto' }}>
                    <tr>
                      <td
                        align="center"
                        style={{
                          backgroundColor: '#17594A',
                          borderRadius: '12px',
                          padding: '14px 32px',
                        }}
                      >
                        <a
                          href="https://observatoriov2.vercel.app/publicaciones"
                          style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'inline-block',
                          }}
                        >
                          Ver Publicaciones
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              {/* Footer */}
              <tr>
                <td
                  style={{
                    backgroundColor: '#f9fafb',
                    padding: '30px',
                    textAlign: 'center',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '0 0 10px 0',
                    lineHeight: '1.5'
                  }}>
                    <strong>Observatorio de la Educación en Córdoba</strong><br />
                    Universidad Cooperativa de Colombia - Sede Montería
                  </p>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#9ca3af', 
                    margin: 0 
                  }}>
                    Este es un mensaje automático de confirmación.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  );
}
