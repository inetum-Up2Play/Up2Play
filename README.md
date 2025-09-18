# Up2Play

Aplicación que ofrece una comunidad de deportistas con los que poder organizar partidos o salidas para practicar cualquier deporte.

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