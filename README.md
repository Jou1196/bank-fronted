# 💻 Angular CRM – Frontend

Frontend del sistema de banca desarrollado en **Angular 18**, encargado de la visualización de **clientes, cuentas, movimientos y reportes de estado de cuenta**, consumiendo una arquitectura **backend basada en microservicios con Spring Boot**.

---

# 🚀 Tecnologías

- Angular 18  
- TypeScript    
- RxJS  
- SCSS  
- Jest  

---

# 📁 Estructura del Proyecto

```
angular-crm
│
└── src/app
    ├── pages
    │   ├── customers
    │   ├── accounts
    │   ├── movements
    │   └── reports
    │
    └── services
```

Cada módulo corresponde a una funcionalidad del sistema bancario.

---

# ▶️ Requisitos

- Node.js 18+
- Angular CLI

Instalar Angular CLI si no está instalado:

```bash
npm install -g @angular/cli
```

---

# ▶️ Instalación

```bash
npm install
```

---

# ▶️ Ejecución

```bash
ng serve
```

Abrir en navegador:

```
http://localhost:4200
```

---

# 🔗 Backend (Microservicios)

El frontend consume APIs desde los siguientes servicios:

| Servicio | Puerto | Descripción |
|--------|--------|-------------|
| customer-service | 8081 | Gestión de clientes |
| account-service | 8082 | Gestión de cuentas |
| movement-service | 8083 | Gestión de movimientos |
| report-service | 8084 | Generación de reportes |

Ejemplo de endpoint utilizado por el frontend:

```
GET /api/reportes/estado-cuenta?customerId={uuid}&from=yyyy-MM-dd&to=yyyy-MM-dd
```

---

# 📘 Documentación de APIs

La documentación de los endpoints se puede visualizar mediante **Swagger UI** en cada microservicio.

Ejemplo:

```
http://localhost:8084/swagger-ui/index.html
```

---

# 📄 Funcionalidades

### 👤 Customers
- Listado de clientes
- Navegación a cuentas del cliente
- Acceso a reportes

### 💳 Accounts
- Visualización de cuentas por cliente
- Consulta de detalles de cuenta

### 💰 Movements
- Listado de movimientos por cuenta
- Consulta de historial

### 📊 Reports
- Selección de rango de fechas
- Generación de estado de cuenta
- Descarga de reporte en PDF

---

# 🧪 Tests

Tests básicos configurados con **Jest**.

Ejecutar:

```bash
npm run test:jest
```

Componentes cubiertos:

- Customers
- Accounts
- Movements
- Reports

---

# 🎨 UI



- Diseño responsivo
- SCSS modular
- Toast notifications
- Navegación clara entre módulos

---



# ✅ Estado del Proyecto

✔ Frontend funcional  
✔ Integración con backend de microservicios  
✔ Generación de reportes PDF operativa  
✔ Navegación completa entre módulos  
✔ Tests básicos configurados  

---

# 👨‍💻 Autor

Joseph Arias – Frontend  
Sistema de Banca
