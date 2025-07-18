# Nestjs-Project

# NestJS User & Document Management API

A robust backend API built with NestJS, featuring:

- User Authentication: Register, Login, Logout  
- Role-Based Access Control (RBAC) with Roles & Permissions  
- Admin-only User Management APIs for managing roles and permissions  
- CRUD operations for Documents, including file uploads  
- PostgreSQL database integration with TypeORM  

---

## Features

### Authentication
- Register new users with hashed passwords  
- Login with JWT-based authentication  
- Secure logout functionality  

### Role-Based Access Control
- Users assigned multiple roles  
- Roles have multiple permissions  
- Route guards enforce permissions and roles  
- Admin APIs to manage users, roles, and permissions  

### Document Management
- Create, Read, Update, Delete (CRUD) documents  
- Upload documents via multipart/form-data  
- Documents linked to owners (users)  
- Metadata stored in PostgreSQL, files stored on disk/cloud  

---

## Technologies Used

- [NestJS](https://nestjs.com/) — Node.js framework  
- [TypeORM](https://typeorm.io/) — ORM for PostgreSQL  
- [PostgreSQL](https://www.postgresql.org/) — Relational database  
- [Passport](http://www.passportjs.org/) — Authentication middleware  
- [JWT](https://jwt.io/) — JSON Web Tokens for auth  
- [Multer](https://github.com/expressjs/multer) — File uploads  

---

## Getting Started

### Prerequisites
- Node.js >= 16  
- PostgreSQL database  

### Installation

```bash
git clone with https://github.com/PARMECH/Nestjs-Project.git
cd your-repo
npm install
