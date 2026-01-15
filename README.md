

 Observar la documentacion de los servicios rest en http://localhost:8080/swagger-ui/index.html para visualizar de mejor manera los endpoinst se agrego swwagger


# 💻 Angular CRM – Frontend

Frontend del sistema de banca desarrollado en Angular, encargado de la visualización de clientes, cuentas, movimientos y generación de reportes en PDF, consumiendo un backend en Spring Boot.

## 🚀 Tecnologías
Angular 18 · TypeScript · PrimeNG · RxJS · SCSS · Jest

## 📁 Estructura
angular-crm/
src/app/pages/customers  
src/app/pages/accounts  
src/app/pages/movements  
src/app/pages/reports  
src/app/services  

## ▶️ Requisitos
Node.js 18+ · Angular CLI

## ▶️ Instalación
npm install

## ▶️ Ejecución
ng serve  
http://localhost:4200

## 🔗 Backend
El frontend consume APIs desde:  
http://localhost:8080

Ejemplo:
GET /reports?customerId={uuid}&from=yyyy-MM-dd&to=yyyy-MM-dd

## 📄 Funcionalidades
Customers: listado, búsqueda, navegación a cuentas y reportes  
Accounts: listado de cuentas por cliente  
Movements: movimientos por cuenta  
Reports: selección de fechas, generación y descarga de PDF, botón regresar

## 🧪 Tests
Tests básicos con Jest:
npm run test:jest

Componentes cubiertos:
Customers · Accounts · Movements · Reports

## 🎨 UI
PrimeNG, diseño responsivo, SCSS modular, Toast para mensajes, botones de navegación claros.

## 🐳 Docker (opcional)
FROM node:18-alpine  
WORKDIR /app  
COPY . .  
RUN npm install  
RUN npm run build  
EXPOSE 4200  
CMD ["npm","run","start"]

Build:
docker build -t angular-crm .

Run:
docker run -p 4200:4200 angular-crm

## ✅ Estado
Frontend funcional, integrado con backend, reportes PDF operativos y tests mínimos configurados.

## 👨‍💻 Autor
Angular CRM – Frontend  
Sistema de Banca
