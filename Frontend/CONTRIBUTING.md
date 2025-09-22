# Contribuir a UP2Play (Angular 20, Zoneless, SCSS)

> Esta guía explica **cómo trabajamos** y **las buenas prácticas a seguir**. Si algo no está, lo añadimos entre todos.
> Versión del stack: **Angular 20**, **Zoneless** (sin Zone.js) y **SCSS**.

---

## 1) Principios del proyecto (reglas simples)

- **Simplicidad > complejidad.** Si hay dos formas, elige la más clara.
- **Carpetas pequeñas:** si una carpeta supera **7 ficheros**, divídela en subcarpetas.
- **Cada cosa en su sitio:**  
  - **Componentes** pintan la interfaz.  
  - **Servicios** hablan con APIs o aplican reglas de negocio.  
  - **Modelos (interfaces)** describen datos (sin lógica).
- **Angular moderno:** componentes y rutas **standalone** (sin NgModules), **signals** para estado local y **control de flujo** nuevo en plantillas (`@if`, `@for`, `@switch`).
- **Zoneless:** sin Zone.js; la UI se actualiza cuando realmente cambian los datos (modelo SPA).

---

## 2) Estructura de carpetas

Organizamos por **features** (funcionalidades) y dos zonas transversales: `core` y `shared`.

"Core" será para componentes universales del proyecto (header, footer...)

"Shared" son componentes comunes en algún punto del proyecto pero que no aparecene en cada página (card común, botones comunes).

```
src/
  app/
    core/          # global a toda la app (no depende de una feature)
      config/      # configuración global, tokens, providers
      layout/      # Shell, header, footer, loaders
      guards/      # lógica de acceso a rutas
      interceptors/# auth, errores, logging
      services/    # servicios globales (AuthService, AppConfigService...)
    shared/        # reutilizable en cualquier feature
      components/  # UI genérica (botones, modal, card...)
      directives/  # directivas pequeñas (auto-focus, etc.)
      pipes/       # pipes reutilizables (fecha bonita, etc.)
      models/      # interfaces y tipos (sin Angular)
      utils/       # funciones puras de ayuda
    features/
      activity/    # ejemplo de feature "Actividad"
        pages/     # páginas con ruta (URL)
        components/# piezas internas de la feature
        data/      # servicios de datos de la feature (HTTP, etc.)
        models/    # interfaces del dominio de esta feature
        activity.routes.ts
      user/
        ...
    app.routes.ts  # rutas raíz (carga perezosa de features)
    app.config.ts  # configuración global (router, http, zoneless...)
  assets/
  styles/          # estilos globales mínimos (SCSS)
```

**Qué va en cada zona (en lenguaje simple):**

- **core/**: lo que “enciende” la app y cosas transversales (interceptores, layout, config).
- **shared/**: piezas de UI y utilidades que sirven en cualquier parte.
- **features/**: cada “módulo de negocio” (Actividad, Usuario…) con sus páginas, componentes y servicios propios.

---

## 3) Qué es cada cosa y cuándo se usa

- **Componente** → una “pieza de pantalla” (vista).  
  *Cuándo:* cualquier cosa visible (página, tarjeta, formulario).

- **Servicio** → una clase sin interfaz que hace trabajo “serio”.  
  *Cuándo:* hablar con APIs, guardar datos compartidos, reglas de negocio.

- **Interface** → describe cómo luce un dato.  
  *Cuándo:* para tipar modelos: `Activity { id: string; name: string }`.

- **Signals** (`signal`, `computed`, `effect`) → guardan estado y actualizan la vista automáticamente.  
  *Cuándo:* estado **local** del componente (filtros, selección, contadores).

- **Plantillas con `@if`, `@for`, `@switch`** → mostrar/ocultar contenido y listas.  
  *Tip:* en `@for` usa `track item.id` para que la lista sea rápida.

- **Rutas** → definen qué página se muestra en cada URL.  
  *Rutas paramétricas:* URL con variables (`/activity/:id`) para ir a detalles.

- **Formularios reactivos** → formularios fáciles de validar y mantener.  
  *Regla de oro:* si hay errores, se muestran cuando el usuario toca el campo.

- **Zoneless** → Angular sin Zone.js (mejor rendimiento y SPA).  
  *Qué cambia para nosotros:* usar señales/eventos/`async` pipe y listo.

---

## 4) Dónde crear cosas nuevas (y comandos)

> Usamos Angular CLI (standalone + SCSS). Ejecuta estos comandos desde la raíz:

- **Componente (standalone) en una feature**
  
  ```bash
  ng g c features/activity/pages/activity-list
  ```

- **Servicio en la feature**
  
  ```bash
  ng g s features/activity/data/activity
  ```

- **Directiva/Pipe reutilizable en shared**
  
  ```bash
  ng g d shared/directives/auto-focus
  ng g p shared/pipes/pretty-date
  ```

- **Guard / Interceptor (si hace falta)**

  ```bash
  ng g g core/guards/auth
  ng g interceptor core/interceptors/auth-token
  ```

---

## 5) Rutas (incluye rutas con parámetros)

- **Rutas raíz** en `app.routes.ts` → cada feature debería ser una vista (ruta).
- **Rutas de feature** en `features/<nombre>/<nombre>.routes.ts`.
- **Parámetros en URL** (`/activity/:id`): el componente de detalle recibe el `id`.
  - Opción sencilla: activamos `withComponentInputBinding` en el router y el componente recibe el parámetro como `@Input`. (REVISAR TODAVÍA, NO FIARSE)

---

## 6) Formularios y validación (paso a paso)

1. Crea un `FormGroup` con los campos.  
2. Añade validadores (`required`, `minLength`, etc.).  
3. Muestra el mensaje de error **solo** si el campo está “tocado”.  
4. Al enviar, si hay errores, `markAllAsTouched()` para que se vean.

> Si el formulario crece, separa por secciones o pasos.

---

## 7)  Cómo ejecutar, comprobar y compilar

```bash
# Arrancar la app en local
ng serve

# Build producción
ng build 
```

---

## 8) Pluggins para Angular y configuración de VS Code

Los pluggins que se muestran y las configuracions de VS Code son solo recomendaciones y no son obligatorias. Todas las recomendaciones están probadas y pensadas para facilitar y mejorar el flujo de trabajo.

### - Configuración VS Code:

- **Autocompletar comandos en la terminal**. Acceder a `settings` >> buscar `terminal integrated suggest` >> marcar el check `Enable...`

- **Linked editting**. Ayuda sobretodo en la escritura de etiquetas como HTML, pero funciona para más lenguajes. Por ejemplo, cuando modificas una etiqueta, también se modifica la de cierre. Acceder a `settings` >> buscar `linked editting` >> marcar el check `Controls...`

### - Extensiones para Angular:

- **Angular Language Service**. Esta extensión es la única prácticamente obligatoria. Recomendada por el propio Angular, agiliza la escritura de código en proyectos Angular.

- **Angular Files**. Permite la generación de elementos Angular mediante interfaz. Sustituye los comandos comunes de "ng g..." por un /click derecho sobre la carpeta del proyecto en la que quieras generar el archivo.

- **Angular2.switcher**. Sirve para navegar entre archivos desde el código. Cuando se hace import de algún comoponente, o se llama a alguna clase, haciendo click sobre el código te redirige al archivo sin necesidad de buscarlo manualmente.

---

## 9) Preguntas rápidas (FAQ)

- **¿Cuándo creo una subcarpeta?**  
  Cuando una carpeta tenga más de ~7 ficheros, o para separar `pages/components/data/models`.

- **¿Puedo meter HTTP en un componente?**  
  Mejor **no**. Crea un **servicio** y úsalo desde el componente.

- **¿`@if` o `*ngIf`?**  
  Usa `@if/@for/@switch` (moderno y más claro). `*ngIf/*ngFor` siguen existiendo, pero unificamos.

---

## 10) Referencias rápidas

- Zoneless (qué es y cómo activarlo): <https://angular.dev/guide/zoneless>
- Control de flujo en plantillas: <https://angular.dev/guide/templates/control-flow>
- Signals (estado reactivo): <https://angular.dev/guide/signals>
- Rutas (definir rutas, lazy, parámetros) y binding a inputs:  
  <https://angular.dev/guide/routing/define-routes>  
  <https://angular.dev/guide/routing/common-router-tasks>
- Reactive Forms (formularios y validación): <https://angular.dev/guide/forms/reactive-forms>
- CLI para generar componentes standalone: <https://angular.dev/cli/generate/component>
