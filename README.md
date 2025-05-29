# Sistema de sugerencias de cursada y acompañamiento académico - Backend

API rest del sistema de sugerencias de cursada y acompañamiento académico.

## 🧩 Tecnologías

- **Node.js 18.16.0**: Entorno de ejecución de JavaScript multiplataforma.
- **Express 4.16.1**: Framework minimalista y flexible para Node.js.
- **Mongoose 6.7.2**: Biblioteca de modelado de objetos (ODM) para MongoDB y Node.js.

### Base de datos

- **MongoDB**: Sistema de base de datos no relacional, orientado a documentos y de código abierto. Utiliza colecciones y documentos en formato JSON en lugar de tablas tradicionales.

## 🛠️ Herramientas necesarias para desarrollo local

Para iniciar el proyecto de forma local se requieren las siguientes herramientas instaladas:

- **GitHub**: Herramienta de control de versiones que aloja proyectos bajo el sistema de control de versiones Git.
- **Node.js 18.16.0**: Entorno de ejecución de JavaScript multiplataforma.
- **Visual Studio Code (o similar)**: Editor de código fuente.
- **MongoDB Compass**: Herramienta gráfica para gestionar bases de datos de MongoDB.

## Instalación

Para instalar el proyecto de manera local debe seguir los siguientes pasos:

Navegar hacia la carpeta elegida para contener el proyecto.

Abrir la terminal de comandos/Git Bash.

Clonar el repositorio Backend con el siguiente comando sin las comillas:

```bash
  git clone "link del repositorio"
```

Ingresar a la carpeta con el comando:

```bash
  cd cidia-retencion-backend
```

O ingresar con el sistema de carpetas y abrir una nueva terminal.

Instalar las dependencias ejecutando el siguiente comando:

```bash
  npm install
```

Luego ejecutar el comando

```bash
  git checkout dev
```

para tener el repositorio con las últimas actualizaciones.

Abrir el programa MongoDB Compass.

Seleccionar la opción “copy connection string”, esto copiará en nuestro portapapeles el link a nuestro cluster gratuito que fue creado al registrarnos y descargar MongoDB Compass.

Crear en la raíz de la carpeta un archivo llamado .env y dentro de este archivo crear una variable llamada

```bash
  MONGO_DB_URL=""
```

y a continuación pegar el string de conexión junto a la variable dentro de comillas.
Ejemplo:

```bash
  MONGO_DB_URL="link de conexión"
```

Para iniciar la aplicación ejecutar el siguiente comando en el repositorio del proyecto.

```bash
  npm start
```

Por defecto la URL del Backend es http://localhost:3001.

## API Siu Guaraní

Esta API necesita acceso a un Mock de la API del sistema Siu Guaraní para funcionar. Podes encontrarla en el siguiente link:

[Repositorio API Mock Guaraní](https://github.com/unahur-desapp/cidia-retencion-mock-api-guarani.git)
