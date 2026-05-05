

# ReadStack

## Índice

* Resumen del Proyecto
* Backend - Documentación Técnica
* Frontend - Documentación Técnica
* Instalación y Configuración
* API Endpoints
* Modelos de Datos
* Seguridad
* Despliegue
* Capturas de Pantalla
* Contribución
* Licencia

---

## Resumen del Proyecto

ReadStack es una aplicación web diseñada para lectores que desean mantener un registro digital detallado de su progreso de lectura, replicando la experiencia personalizada de interactuar con un libro físico.

---

## Problemática que resuelve

Cuando se dispone de un libro físico, es posible:

* Asignar post-its de colores en páginas importantes
* Escribir pensamientos en los márgenes
* Subrayar frases memorables
* Marcar páginas con distintos elementos visuales

Sin embargo, al utilizar libros digitales o prestados, estas acciones no son posibles.

ReadStack permite recuperar esa experiencia mediante:

* Registro de momentos relevantes de cada lectura
* Uso de etiquetas por colores
* Almacenamiento de citas textuales
* Registro de hasta 10 comentarios por sesión
* Visualización de estadísticas de lectura
* Seguimiento de rachas
* Organización en listas y colecciones personalizadas

---

# Backend - Documentación Técnica

## Tecnologías del Backend

| Tecnología   | Versión | Propósito                   |
| ------------ | ------- | --------------------------- |
| Node.js      | 20.x    | Entorno de ejecución        |
| Express      | 4.x     | Framework API REST          |
| MongoDB      | 6.x     | Base de datos               |
| Mongoose     | 8.x     | Modelado de datos           |
| JWT          | 9.x     | Autenticación               |
| bcrypt       | 5.x     | Seguridad de contraseñas    |
| Google OAuth | -       | Autenticación social        |
| Cloudinary   | 2.x     | Gestión de imágenes         |
| Multer       | 1.x     | Subida de archivos          |
| Redis        | 7.x     | Sistema de colas            |
| Bull         | 4.x     | Procesamiento de trabajos   |
| Resend       | 3.x     | Envío de correos            |
| Winston      | 3.x     | Logging                     |
| Socket.IO    | 4.x     | Comunicación en tiempo real |
| Joi          | 17.x    | Validación                  |

---

## Arquitectura del Backend

El backend sigue una arquitectura MVC (Model-View-Controller) adaptada a API REST, separando la lógica de negocio, los modelos de datos y las rutas.

---

## Estructura del Backend

```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── jobs/
│   ├── producers/
│   ├── workers/
│   ├── validation/
│   ├── sockets/
│   └── consts/
├── logs/
├── uploads/
├── .env
├── package.json
└── server.js
```

---

## Flujo de peticiones

<img src="https://github.com/user-attachments/assets/b635c9d8-5ab4-4a66-a650-913740102ded" />

---

## Modelos de Datos

<img src="https://github.com/user-attachments/assets/f6400bc1-a177-4103-9398-94d322525bf9" />

---

## API Endpoints

### Autenticación (/api/auth)

| Método | Endpoint                | Descripción             |
| ------ | ----------------------- | ----------------------- |
| POST   | /register               | Registrar usuario       |
| POST   | /login                  | Iniciar sesión          |
| POST   | /google                 | Login con Google        |
| POST   | /logout                 | Cerrar sesión           |
| POST   | /update-profile         | Actualizar perfil       |
| POST   | /request-reset-password | Solicitar recuperación  |
| POST   | /reset-password         | Restablecer contraseña  |
| GET    | /check                  | Verificar autenticación |

---

### Libros (/api/books)

| Método | Endpoint |
| ------ | -------- |
| GET    | /        |
| GET    | /:id     |
| POST   | /        |
| PUT    | /:id     |
| DELETE | /:id     |

---

### Entradas (/api/entries)

| Método | Endpoint      |
| ------ | ------------- |
| GET    | /             |
| GET    | /stats/streak |
| GET    | /:id          |
| POST   | /             |
| PUT    | /:id          |
| DELETE | /:id          |

---

### Listas (/api/lists)

| Método | Endpoint   |
| ------ | ---------- |
| GET    | /          |
| POST   | /          |
| GET    | /:id       |
| PUT    | /:id       |
| DELETE | /:id       |
| GET    | /:id/books |
| PUT    | /:id/books |

---

### Colecciones (/api/collections)

| Método | Endpoint                     |
| ------ | ---------------------------- |
| GET    | /                            |
| POST   | /                            |
| GET    | /:id                         |
| PUT    | /:id                         |
| DELETE | /:id                         |
| PATCH  | /:id/archive                 |
| POST   | /:collectionId/lists         |
| DELETE | /:collectionId/lists/:listId |

---

### Estadísticas (/api/stats)

| Método | Endpoint   |
| ------ | ---------- |
| GET    | /dashboard |

---

## Seguridad

* Autenticación mediante JWT en cookies HTTP-only
* Expiración configurable de tokens
* Hash de contraseñas con bcrypt
* Validación de datos con Joi
* Sanitización de entradas
* Prevención de inyección
* Control de origen (CORS)
* Limitación de peticiones (rate limiting)
* Protección contra XSS

---

# Frontend - Documentación Técnica

## Tecnologías del Frontend

| Tecnología          | Versión | Propósito        |
| ------------------- | ------- | ---------------- |
| React               | 19.2.5  | Interfaz         |
| React Router DOM    | 7.14.2  | Navegación       |
| Zustand             | 5.12.0  | Estado global    |
| Axios               | 1.15.2  | HTTP             |
| Tailwind CSS        | 4.2.4   | Estilos          |
| Vite                | 8.0.9   | Build tool       |
| date-fns            | 4.1.0   | Manejo de fechas |
| Lucide React        | 1.8.0   | Iconos           |
| React Hot Toast     | 2.6.0   | Notificaciones   |
| @react-oauth/google | 0.13.5  | Login con Google |

---

## Estructura del Frontend

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── utils/
│   ├── styles/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env
├── package.json
├── vite.config.js
└── tailwind.config.js
```



## Capturas de Pantalla

Aquí tienes la sección de **Capturas de Pantalla usando tablas**, organizada y más visual para un README:

---

## Capturas de Pantalla

### Autenticación

|                                                                                               |                                                                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/79d4c653-5561-4a67-b224-02ee5d881414" /> | <img src="https://github.com/user-attachments/assets/8ddc415d-5139-4e14-94e3-f5ed1fcde363" /> |

---

### Estadísticas

|                                                                                               |                                                                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/becca8ce-ffab-4002-8e3b-9b32cd8c0e80" /> | <img src="https://github.com/user-attachments/assets/17900f67-5c9b-4332-bf80-f0f644754f1b" /> |

---

### Libros

|                                                                                               |                                                                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/41c6e3cc-8894-45a8-9778-f105ab06dd94" /> | <img src="https://github.com/user-attachments/assets/03940830-35d2-43bd-b2eb-112e8e1c4562" /> |
| <img src="https://github.com/user-attachments/assets/99f48330-8bd3-4518-841a-97a5dec90a51" /> | <img src="https://github.com/user-attachments/assets/a0df1df5-b1cf-4e55-884f-a12a7f3eaa96" /> |

---

### Listas

|                                                                                               |                                                                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/6ab4d6cf-45df-49cd-8680-1baf05230da5" /> | <img src="https://github.com/user-attachments/assets/1a94792e-28e7-4074-85b8-a78f815d44ea" /> |
| <img src="https://github.com/user-attachments/assets/5017848b-c65b-408d-9f00-6330d514dfd7" /> | <img src="https://github.com/user-attachments/assets/fdfe9acf-0716-403c-982b-564ec4b1331c" /> |
| <img src="https://github.com/user-attachments/assets/c31ee8bf-ae87-457f-918b-9cd99bf4fc6c" /> | <img src="https://github.com/user-attachments/assets/8b738b51-9b6c-41e4-91a2-0778da4fc5a3" /> |

---

### Colecciones

|                                                                                               |                                                                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/cd684702-fb61-406d-89d6-7c46c1865f40" /> | <img src="https://github.com/user-attachments/assets/e859e619-6116-43f1-853d-f4827a946eb4" /> |
| <img src="https://github.com/user-attachments/assets/d3c978d9-1ab2-46d2-895b-2ec5f0e52618" /> |                                                                                               |

---

### Entradas de Lectura

|                                                                                               |                                                                                               |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/d30e045c-1fe2-4ac0-8bf7-c387239fa807" /> | <img src="https://github.com/user-attachments/assets/c91d962a-f6d8-463f-a3a3-4eadcd9bdeb3" /> |
| <img src="https://github.com/user-attachments/assets/a311302b-1cf5-42c5-956a-5e51324f3731" /> | <img src="https://github.com/user-attachments/assets/031379d4-1e9c-4fa1-bd3e-ffdcd104eafe" /> |
| <img src="https://github.com/user-attachments/assets/0ff25fb8-45a4-41f9-bc6d-a97a4ff4ee7f" /> | <img src="https://github.com/user-attachments/assets/a8837870-b44f-413b-a3ea-d92eedb32531" /> |
| <img src="https://github.com/user-attachments/assets/03338a26-c3f9-4acb-a313-6c80a2633170" /> |                                                                                               |

---


## Desarrolladora

Johaly Concepción Polanco
