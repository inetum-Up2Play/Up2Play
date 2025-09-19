# Up2Play

Aplicación que ofrece una comunidad de deportistas con los que poder organizar partidos o salidas para practicar cualquier deporte.

---

## Convención de nombres

Las convenciones de nombres son esenciales para mantener la organización y claridad en los proyectos, facilitando la colaboración y el seguimiento de cambios.

### Ramas:

- **feature** → feature/nombre-descriptivo-funcionalidad.
    
    Ejemplos: feature/login-usuario, feature/mejoras-ui
    
- **hotfix** → hotfix/descripcion-arreglo.
    
    Ejemplo: hotfix/error-login
    
- **release** → release/vX.Y.Z o release/nombre-version
    
    Ejemplo: release/v1.2.0
    

### Commits:

- **feat**: Nueva funcionalidad. **Ejemplo** → feat: añadir pantalla de registro
- **fix**: Corrección de errores. **Ejemplo** → fix: corregir validación de email
- **docs**: Cambios en documentación. **Ejemplo** → docs: actualizar README con instrucciones de instalación
- **refactor**: Reestructuración del código sin cambiar funcionalidad. **Ejemplo →** refactor: simplificar lógica de autenticación
- **style**: Cambios de formato, no afectan la lógica del código, solo su presentación.  **Ejemplo →**  style: eliminar espacios innecesarios en funciones
- **test**: Añadir o modificar pruebas.   **Ejemplo** → test: añadir pruebas unitarias para el componente Login
- **chore**: Tareas menores (actualizar dependencias, configuración, etc.). **Ejemplo** → chore: actualizar dependencias en package.json
- **perf**: Mejoras de rendimiento. **Ejemplo** → perf: reducir tiempo de carga en la pantalla de inicio
- **ci**: Cambios en scripts, workflows o configuración de CI/CD. **Ejemplo** → ci: añadir workflow de GitHub Actions para test
    
    **Importante**:
    
    - Usa el **modo imperativo**: “añadir” en lugar de “añadido”.
    - Sé **breve pero claro**: máximo 50 caracteres en el título.
    - Si necesitas más detalle, añade una descripción en el cuerpo del commit.

### **Comentarios en el código**

- Comenta el código de manera clara y directa explicando el porqué de esa acción.
- Evita comentarios innecesarios como // incrementa x en 1 si el código ya lo dice.
- Ejemplo:
    
    // Este método se usa para validar tokens expirados antes de renovar sesión
    function validarToken() { ... }
    

### Generales

- **Usar Guiones**: Se recomienda usar guiones para separar palabras en lugar de espacios.
- **Mantenerlo Corto y Descriptivo**: Los nombres deben ser fáciles de escribir y entender, transmitiendo la información necesaria.
- **Minúsculas**: Usar letras minúsculas para evitar confusiones, ya que Git distingue entre mayúsculas y minúsculas.
- **Evita caracteres especiales.**

---

## Tags

Una etiqueta sirve para identificar commits particulares. El uso más normal de los tags es poder etiquetar las diferentes versiones de un proyecto. Ejemplo de tag: **v0.2.0**

**Comandos**:

- **git tag <nombre-tag> →** Crear un tag en el último commit creado.
- **git tag <nombre-tag> <numero-commit> →** Crear un tag en un commit concreto.
- **git tag →** Listar todos los tags.

Buenas prácticas:

- Usa etiquetas **solo en commits estables** (por ejemplo, después de una `release`).
- Mantén un **changelog*** asociado a cada versión etiquetada.
- No reutilices etiquetas: si necesitas una nueva versión, crea una nueva etiqueta.

***changelog**:

Un **changelog** (o registro de cambios) es un documento que **resume los cambios realizados en cada versión** del proyecto. 

Suele estar en un archivo llamado **CHANGELOG.md** en la raíz del repositorio. Un ejemplo de estructura básico sería:


# Changelog

Todas las versiones importantes de este proyecto se documentan aquí.

## [1.2.0] - 2025-09-19
### Añadido
- Pantalla de perfil de usuario
- Validación de campos en el formulario de registro
### Corregido
- Error al iniciar sesión con redes sociales

### Mejorado
- Rendimiento en la carga de la pantalla principal
## [1.1.0] - 2025-09-10
### Añadido
- Integración con API externa para estadísticas

### Corregido
- Problema con la navegación en dispositivos móviles



---

## Comandos Útiles

### **Comandos básicos del sistema:**

- **ls**: Lista los archivos y carpetas del directorio actual
- **pwd**: Muestra la ruta del directorio en el que te encuentras.
- **cd <nombre_carpeta>**: Cambia al directorio indicado.
- **mkdir <nombre_carpeta>**: Crea una nueva carpeta.

### **Comandos de Git**:

- **git pull:**  Descarga la última versión del repositorio remoto y actualiza tu copia local.
- **git branch**: Muestra todas las ramas disponibles en el repositorio.
- **git branch <nombre_rama>**: Crea una nueva rama con el nombre especificado.
- **git checkout <nombre_rama>**:Cambia a la rama indicada.
- **git push origin <nombre_rama>**: Sube la rama actual al repositorio remoto. (Asegúrate de estar ubicado en la rama que deseas subir).
- **git diff <rama1> <rama2>**: Muestra las diferencias entre dos ramas.

### **Estados:**

- **Modified**: El archivo ha sido modificado localmente.
- **Staged**: Los cambios han sido preparados para ser confirmados. → Usa **git add .** para añadir todos los archivos modificados, o **git add <archivo>** para añadir uno específico.
- **Committed**:  Los cambios han sido confirmados localmente. → Usa **git commit -m "Descripción del cambio"** para registrar los cambios.
- **Pushed**: Los cambios han sido enviados al repositorio remoto.→ Usa **git push** para subir los commits.

---

## Configuración de acceso SSH a GitHub

Para trabajar cómodamente con este repositorio, recomendamos configurar el acceso SSH. Esto evita tener que introducir credenciales cada vez.

### 1. Verifica si ya tienes acceso SSH a Github

Si ya has configurado SSH anteriormente para otro proyecto, no necesitas repetir el proceso.
Para comprobar si tienes acceso, abre una terminal y ejecuta: "ssh -T [git@github.com](mailto:git@github.com)". Si tienes acceso, aparecerá un mesaje como este: "Hi usernam"! You've successfully authenticated, but GitHub does not provide shell access."

### 2. Si no tienes acceso, sigue estos pasos:

1. Genera una clave SSH com el comando: ssh-keygen -t ed25519 -C "[tu-email@example.com](mailto:tu-email@example.com)" (Esto generará automáticamente una clave pública y una privada en la carpeta ~/.ssh.)
2. Añade tu clave pública a GitHub:
-Abre el archivo de tu clave pública (la que acaba en .pub).
-Copia su contenido.
-Ve a GitHub → Settings → SSH and GPG keys y haz clic en New SSH key.
-Pega la clave y guarda.
3. Prueba la conexión desde tu terminal con el comando ssh -T [git@github.com](mailto:git@github.com)