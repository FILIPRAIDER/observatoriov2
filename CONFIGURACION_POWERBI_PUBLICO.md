# Configuración de Power BI para visualización pública

## Problema actual
Los dashboards de Power BI requieren autenticación para visualizarse, lo cual no es deseado para la página web pública del Observatorio.

## Soluciones disponibles

### Opción 1: Publicar en web (Completamente público - RECOMENDADA)

Esta es la opción más simple y completamente gratuita.

#### Pasos:
1. Abre el informe en Power BI Service (app.powerbi.com)
2. Ve a **Archivo** → **Insertar informe** → **Publicar en web (público)**
3. Power BI generará un código de inserción con una URL pública
4. Copia la URL del `src` del iframe

**Ejemplo de URL generada:**
```
https://app.powerbi.com/view?r=eyJrIjoiXXXXXX...
```

#### Actualizar en Laravel:
```php
// En Filament o tu panel de administración
PowerbiDashboard::create([
    'name' => 'Saber 11 en Córdoba',
    'embed_url' => 'https://app.powerbi.com/view?r=eyJrIjoiXXXXXX...',
    'category' => 'educacion',
    'is_active' => true,
]);
```

**⚠️ Advertencia:** Esta opción hace el dashboard completamente público. Cualquiera con el enlace puede verlo.

---

### Opción 2: Power BI Embedded con token anónimo

Esta opción requiere Azure y tiene costos asociados, pero ofrece más control.

#### Requisitos:
- Cuenta de Azure
- Power BI Pro o Premium
- Azure App Service

#### Pasos:
1. Crear una aplicación en Azure Active Directory
2. Configurar permisos de API para Power BI
3. Generar tokens de acceso anónimos desde tu backend Laravel
4. Pasar el token junto con la URL de embed

**Implementación en Laravel:**
```php
// Instalar SDK de Power BI
composer require microsoft/microsoft-graph

// Generar token
$token = $this->generatePowerBIToken($reportId);

// Retornar con el dashboard
return [
    'embed_url' => $embedUrl,
    'access_token' => $token,
];
```

**En el frontend (Next.js):**
```typescript
// Usar el SDK de Power BI
import { PowerBIEmbed } from 'powerbi-client-react';

<PowerBIEmbed
  embedConfig={{
    type: 'report',
    embedUrl: dashboard.embed_url,
    accessToken: dashboard.access_token,
  }}
/>
```

---

## Configuración actual del Frontend

El frontend ya está configurado para recibir URLs públicas:

```typescript
// src/components/cordoba/powerbi/PowerBIEmbed.tsx
const publicUrl = embedUrl.includes('?') 
  ? `${embedUrl}&filterPaneEnabled=false&navContentPaneEnabled=true`
  : `${embedUrl}?filterPaneEnabled=false&navContentPaneEnabled=true`;
```

### Parámetros añadidos:
- `filterPaneEnabled=false`: Oculta el panel de filtros
- `navContentPaneEnabled=true`: Muestra la navegación de páginas

---

## Verificación

Para verificar que funciona:

1. Copia la URL de embed del dashboard
2. Pégala en una ventana de incógnito del navegador
3. Si NO pide login, está configurado correctamente como público
4. Si pide login, necesitas aplicar la Opción 1 o Opción 2

---

## Notas de seguridad

### Para dashboards públicos (Opción 1):
- ✅ No expongas datos sensibles o privados
- ✅ Usa solo datos agregados y estadísticas públicas
- ✅ Revisa periódicamente qué dashboards están públicos

### Para dashboards con token (Opción 2):
- ✅ Los tokens expiran (configurable)
- ✅ Puedes revocar acceso en cualquier momento
- ✅ Logs de acceso disponibles en Azure

---

## Recursos adicionales

- [Documentación oficial de Publicar en web](https://learn.microsoft.com/es-es/power-bi/collaborate-share/service-publish-to-web)
- [Power BI Embedded documentation](https://learn.microsoft.com/es-es/power-bi/developer/embedded/)
- [Pricing de Power BI Embedded](https://azure.microsoft.com/es-es/pricing/details/power-bi-embedded/)

---

## Contacto

Si tienes dudas sobre la implementación, contacta al equipo de desarrollo frontend.
