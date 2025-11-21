# 📧 Nuevas Tablas de Contacto y Newsletter

## 📋 Información para el Backend (Laravel/Filament)

Se han agregado **2 nuevas tablas** a la base de datos MySQL para gestionar los formularios del frontend:

---

## 1. Tabla: `newsletter_subscribers`

### Descripción
**SOLICITUDES DE CONTACTO RÁPIDAS** - Formulario simple en la parte superior de la home que solo pide nombre y correo.

**Ubicación en el sitio:** Primera sección de la home, arriba del hero, con el texto:
*"¿Necesitas información para tomar decisiones en tu institución?"*

**Propósito:** Capturar leads rápidos de instituciones interesadas en servicios del Observatorio (estudios, diagnósticos, asesoría).

**Campos:** Solo nombre y email (formulario minimalista para facilitar conversión).

### Estructura de la Tabla
```sql
CREATE TABLE `newsletter_subscribers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `subscribed` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `newsletter_subscribers_email_unique` (`email`),
  INDEX `newsletter_subscribers_email_index` (`email`),
  INDEX `newsletter_subscribers_subscribed_index` (`subscribed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Campos
- **id**: ID único autoincremental
- **name**: Nombre completo del contacto
- **email**: Email del contacto (único - no permite duplicados)
- **subscribed**: Estado (true = activo, false = contactado/inactivo) - útil para marcar como procesado
- **created_at**: Fecha de la solicitud
- **updated_at**: Fecha de última actualización

**✅ Solo estos 5 campos** - Es un formulario minimalista para captura rápida de leads

### Modelo Laravel Sugerido
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = [
        'name',
        'email',
        'subscribed',
    ];

    protected $casts = [
        'subscribed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function scopeActive($query)
    {
        return $query->where('subscribed', true);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
```

### Resource Filament Sugerido
```php
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterSubscriberResource\Pages;
use App\Models\NewsletterSubscriber;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Tables;

class NewsletterSubscriberResource extends Resource
{
    protected static ?string $model = NewsletterSubscriber::class;
    protected static ?string $navigationIcon = 'heroicon-o-user-plus';
    protected static ?string $navigationLabel = 'Solicitudes Rápidas';
    protected static ?string $navigationGroup = 'Contacto';
    protected static ?string $modelLabel = 'Solicitud';
    protected static ?string $pluralModelLabel = 'Solicitudes Rápidas';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nombre')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
                Forms\Components\Toggle::make('subscribed')
                    ->label('Activo / Pendiente')
                    ->helperText('Desactivar cuando ya se haya contactado')
                    ->default(true),
            ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\BooleanColumn::make('subscribed')
                    ->label('Pendiente')
                    ->trueColor('warning')
                    ->falseColor('success')
                    ->trueIcon('heroicon-o-clock')
                    ->falseIcon('heroicon-o-check-circle')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha de solicitud')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('subscribed')
                    ->label('Estado')
                    ->placeholder('Todos')
                    ->trueLabel('Pendientes')
                    ->falseLabel('Contactados'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterSubscribers::route('/'),
            'create' => Pages\CreateNewsletterSubscriber::route('/create'),
            'edit' => Pages\EditNewsletterSubscriber::route('/{record}/edit'),
        ];
    }
}
```

---

## 2. Tabla: `contact_messages`

### Descripción
**FORMULARIO DE CONTACTO COMPLETO** - Formulario detallado en la sección "Contáctanos" con mapa.

**Ubicación en el sitio:** Sección inferior de la home con mapa de ubicación y formulario completo.

**Propósito:** Mensajes detallados de contacto con toda la información del interesado.

**Campos:** Nombre, email, teléfono, servicio de interés, y mensaje completo.

### Estructura de la Tabla
```sql
CREATE TABLE `contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `service` VARCHAR(255) NULL,
  `message` TEXT NOT NULL,
  `read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `contact_messages_email_index` (`email`),
  INDEX `contact_messages_read_index` (`read`),
  INDEX `contact_messages_created_at_index` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Campos
- **id**: ID único autoincremental
- **name**: Nombre completo del contacto
- **email**: Email del contacto
- **phone**: Teléfono (opcional)
- **service**: Servicio de interés (opcional)
  - Opciones: "Estudios", "Consultorías", "Proyectos de investigación", "Acompañamiento curricular", "Cursos / Diplomados"
- **message**: Mensaje del contacto
- **read**: Estado de lectura (false = no leído, true = leído)
- **created_at**: Fecha del mensaje
- **updated_at**: Fecha de última actualización

### Modelo Laravel Sugerido
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'service',
        'message',
        'read',
    ];

    protected $casts = [
        'read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function markAsRead()
    {
        $this->update(['read' => true]);
    }

    public function markAsUnread()
    {
        $this->update(['read' => false]);
    }
}
```

### Resource Filament Sugerido
```php
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Tables;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;
    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationLabel = 'Mensajes';
    protected static ?string $navigationGroup = 'Contacto';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nombre')
                    ->disabled()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->disabled()
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->label('Teléfono')
                    ->disabled()
                    ->maxLength(50),
                Forms\Components\TextInput::make('service')
                    ->label('Servicio')
                    ->disabled()
                    ->maxLength(255),
                Forms\Components\Textarea::make('message')
                    ->label('Mensaje')
                    ->disabled()
                    ->rows(5),
                Forms\Components\Toggle::make('read')
                    ->label('Leído'),
            ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\BooleanColumn::make('read')
                    ->label('Leído')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nombre')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('service')
                    ->label('Servicio')
                    ->sortable()
                    ->badge(),
                Tables\Columns\TextColumn::make('message')
                    ->label('Mensaje')
                    ->limit(50)
                    ->tooltip(function ($record) {
                        return $record->message;
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('read')
                    ->label('Estado')
                    ->placeholder('Todos')
                    ->trueLabel('Leídos')
                    ->falseLabel('No leídos'),
                Tables\Filters\SelectFilter::make('service')
                    ->label('Servicio')
                    ->options([
                        'Estudios' => 'Estudios',
                        'Consultorías' => 'Consultorías',
                        'Proyectos de investigación' => 'Proyectos de investigación',
                        'Acompañamiento curricular' => 'Acompañamiento curricular',
                        'Cursos / Diplomados' => 'Cursos / Diplomados',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('mark_as_read')
                    ->label('Marcar como leído')
                    ->icon('heroicon-o-check')
                    ->action(fn (ContactMessage $record) => $record->markAsRead())
                    ->visible(fn (ContactMessage $record) => !$record->read),
                Tables\Actions\Action::make('mark_as_unread')
                    ->label('Marcar como no leído')
                    ->icon('heroicon-o-x-mark')
                    ->action(fn (ContactMessage $record) => $record->markAsUnread())
                    ->visible(fn (ContactMessage $record) => $record->read),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkAction::make('mark_as_read')
                    ->label('Marcar como leído')
                    ->icon('heroicon-o-check')
                    ->action(function ($records) {
                        $records->each->markAsRead();
                    }),
                Tables\Actions\DeleteBulkAction::make(),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactMessages::route('/'),
            'view' => Pages\ViewContactMessage::route('/{record}'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::unread()->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        $unread = static::getModel()::unread()->count();
        return $unread > 0 ? 'danger' : null;
    }
}
```

---

## 📊 Dashboard Widget Sugerido

```php
<?php

namespace App\Filament\Widgets;

use App\Models\ContactMessage;
use App\Models\NewsletterSubscriber;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ContactStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Mensajes sin leer', ContactMessage::unread()->count())
                ->description('Mensajes pendientes')
                ->descriptionIcon('heroicon-o-envelope')
                ->color('danger'),
            Stat::make('Mensajes esta semana', ContactMessage::recent(7)->count())
                ->description('Últimos 7 días')
                ->descriptionIcon('heroicon-o-chart-bar')
                ->color('success'),
            Stat::make('Suscriptores activos', NewsletterSubscriber::active()->count())
                ->description('Newsletter')
                ->descriptionIcon('heroicon-o-users')
                ->color('primary'),
        ];
    }
}
```

---

## 🔒 Seguridad Implementada

### Rate Limiting (Frontend)
El frontend implementa rate limiting para prevenir spam:

- **Newsletter**: 3 intentos cada 15 minutos por email
- **Contacto**: 5 intentos cada 30 minutos por email

### Validaciones
- ✅ Formato de email validado
- ✅ Campos requeridos validados
- ✅ Emails únicos en newsletter_subscribers
- ✅ Server-side validation (no solo cliente)

---

## 📧 Sistema de Emails

Los emails se envían automáticamente con **Resend**:

1. **Newsletter**: Email de bienvenida al suscriptor
2. **Contacto**: 
   - Email al equipo (`CONTACT_EMAIL`) con los datos del contacto
   - Email de confirmación al usuario

### Variables de Entorno
```env
RESEND_API_KEY=re_fFa4oYdc_J7y3ojSRVWqBBLWrGPBRgRUC
CONTACT_EMAIL=observatorio@ucc.edu.co
```

---

## 📊 Resumen de Diferencias

| Característica | `newsletter_subscribers` | `contact_messages` |
|---------------|-------------------------|-------------------|
| **Ubicación** | Primera sección (hero) | Sección "Contáctanos" |
| **Tipo** | Lead capture rápido | Mensaje detallado |
| **Campos** | Solo nombre + email | Nombre, email, teléfono, servicio, mensaje |
| **Propósito** | Solicitud de información | Contacto específico con contexto |
| **Email enviado** | Bienvenida al solicitante | Al equipo + confirmación al usuario |

---

## 🚀 Integración Sugerida

1. **Crear los modelos Laravel** en `app/Models/`
2. **Crear los Resources Filament** en `app/Filament/Resources/`
3. **Agregar el widget** al Dashboard
4. **Registrar en Filament** (si es necesario)

### Comando Laravel (opcional)
Si prefieres crear las migraciones desde Laravel:

```bash
php artisan make:model NewsletterSubscriber -m
php artisan make:model ContactMessage -m
```

Luego copia la estructura SQL de este documento a las migraciones.

---

## 📱 Endpoints API (Opcional)

Si deseas exponer API endpoints para gestión externa:

```php
// routes/api.php
Route::get('newsletter-subscribers', [NewsletterController::class, 'index']);
Route::get('contact-messages', [ContactController::class, 'index']);
Route::patch('contact-messages/{id}/read', [ContactController::class, 'markAsRead']);
```

---

## 📈 Métricas Recomendadas

- Total de suscriptores activos
- Tasa de conversión de suscripción
- Mensajes de contacto por servicio
- Tiempo promedio de respuesta a mensajes
- Tasa de cancelación de suscripciones

---

## 🆘 Soporte

Para cualquier duda sobre la integración, revisa:
- Estructura de tablas en este documento
- Modelos Prisma en `prisma/schema.prisma`
- Server actions en `src/app/actions/contact.ts`
