# Up2Play
Aplicación que ofrece una comunidad de deportistas con los que poder organizar partidos o salidas para practicar cualquier deporte.

____________________________________________________________________________________________________________________________________

## Configuración de acceso SSH a GitHub
Para trabajar cómodamente con este repositorio, recomendamos configurar el acceso SSH. Esto evita tener que introducir credenciales cada vez.

### 1. Verifica si ya tienes acceso SSH a Github
Si ya has configurado SSH anteriormente para otro proyecto, no necesitas repetir el proceso. 
Para comprobar si tienes acceso, abre una terminal y ejecuta: "ssh -T git@github.com". Si tienes acceso, aparecerá un mesaje como este: "Hi usernam"! You've successfully authenticated, but GitHub does not provide shell access."

### 2. Si no tienes acceso, sigue estos pasos:
1. Genera una clave SSH com el comando: ssh-keygen -t ed25519 -C "tu-email@example.com" (Esto generará automáticamente una clave pública y una privada en la carpeta ~/.ssh.)
2. Añade tu clave pública a GitHub:
   -Abre el archivo de tu clave pública (la que acaba en .pub).
   -Copia su contenido.
   -Ve a GitHub → Settings → SSH and GPG keys y haz clic en New SSH key.
   -Pega la clave y guarda.
4. Prueba la conexión desde tu terminal con el comando ssh -T git@github.com

