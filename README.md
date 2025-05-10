# 🧠 Task Manager PRO

Полнофункциональное Kanban-приложение для управления проектами, задачами и командами. Поддерживает drag & drop, WebSocket-уведомления, фильтрацию задач, аватарки и email-оповещения о дедлайнах.

---

## ⚙️ Технологический стек

### 🔹 Backend (Spring Boot)
- Java 17, Spring Boot 3
- Spring Security + JWT + Refresh Tokens
- Spring Data JPA + PostgreSQL
- WebSockets (уведомления в реальном времени)
- Email-уведомления (приближающийся и просроченный дедлайн)
- Flyway для миграций
- Расписание задач (`@Scheduled`)

### 🔹 Frontend (React + Vite)
- React + TypeScript
- Vite
- Axios с интерцепторами (авто-refresh токенов)
- Styled Components + MUI
- Drag & Drop (react-beautiful-dnd)
- Отдельные страницы: Projects, Board, Dashboard, Profile

---

## 🚀 Запуск проекта

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/task-manager-pro.git
cd task-manager-pro 
```

### 2. Backend (Spring Boot)
📦 Настройка окружения
Создайте файл .env в папке src/main/resources:
``` env
DB_USERNAME=postgres
DB_PASSWORD=secret123
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
JWT_SECRET=your_jwt_secret_key
```
▶ Запуск:
``` bash
./mvnw spring-boot:run
```
🛠 Требуется PostgreSQL на localhost:5433, база task_manager_pro.

🛠 Настройка БД:
PostgreSQL должна быть запущена локально, а application.yml или application.properties должен содержать правильные данные подключения.

### 3. Frontend (Vite + React)
``` bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
🟢 Убедитесь, что в .env указана правильная переменная:

``` env
VITE_API_URL=http://localhost:8080/api
```
### 📸 Скриншоты
✅ Projects page

✅ Board с колонками и задачами

✅ Drag & drop

✅ Уведомления

✅ Dashboard аналитика

### 👤 Автор 
Saparbek Kozhanazar 
<center> <a href="https://github.com/Saparbek-4"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a> <a href="https://t.me/YOUR_TELEGRAM"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" /></a> <a href="https://linkedin.com/in/YOUR_LINKEDIN"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a> </center>