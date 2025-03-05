# 📊 Social Dashboard - User & Social Media Analytics

**Social Dashboard** is a platform that allows you to manage users and their social media data from platforms like Instagram, Twitter, LinkedIn, and Facebook. It provides tools to visualize key metrics, filter data, and generate insights through interactive charts.

## 🚀 Technologies Used
- **Frontend**: Next.js 14, TailwindCSS, FontAwesome
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Database**: PostgreSQL (Railway)
- **Deployment**: Vercel (Frontend) + Railway (Database)

---

## 📌 Features
✅ Manage users and their social media platforms  
✅ Create, edit, and delete records in real-time  
✅ **Charts** 📊 to visualize key metrics per user  
✅ **Advanced filters** to segment data  
✅ **Delete confirmation modals** with interactive options  
✅ Integration with an external API (`JSONPlaceholder`)  

---

## 📦 Installation & Local Setup

### 1️⃣ **Clone the repository**
```sh
git clone https://github.com/your-username/social-dashboard.git
cd social-dashboard
```

### 2️⃣ **Install dependencies**
Make sure you have **Node.js 18+** and **npm** installed. Then run:
```sh
npm install
```

### 3️⃣ **Set up environment variables**
Create a `.env` file at the project root with the following values:

```ini
DATABASE_URL="postgresql://username:password@host:port/database"
NEXT_PUBLIC_JSON_PLACEHOLDER_URL="https://jsonplaceholder.typicode.com"
```
🔹 *Replace `DATABASE_URL` with your Railway database connection string.*  
🔹 *`NEXT_PUBLIC_JSON_PLACEHOLDER_URL` is optional for loading test data.*  

---

## 🚀 Run in Development Mode
Once configured, start the development server:
```sh
npm run dev
```
📌 **Access the app at:** [http://localhost:3000](http://localhost:3000)

---

## 🔧 Database Setup with Prisma

### 1️⃣ **Generate Prisma files**
```sh
npx prisma generate
```

### 2️⃣ **Apply database migrations**
```sh
npx prisma migrate deploy
```

### 3️⃣ **Seed the database with test data**
```sh
npm run seed
```
*(If you need to clear the database first, run `npm run clear-db` before seeding).*

---

## 📊 Using the Dashboard
1. **Users**: Add and edit users with social media data.  
2. **Platforms**: Manage the social media accounts linked to each user.  
3. **Charts** 📈: Analyze metrics with **bar, line, doughnut, and pie charts**.  
4. **Filters**: Filter by user, platform, followers, engagement, etc.  
5. **Delete confirmation modals** with interactive options.

---

## ☁️ Deploying to Production

### 1️⃣ **Frontend Deployment on Vercel**
If you have a **Vercel** account, deploy with:
```sh
vercel
```

📌 **Set environment variables in Vercel**  
Go to **Settings > Environment Variables** and add the `.env` values.

### 2️⃣ **Database Deployment on Railway**
Host your **PostgreSQL** database on **Railway** and copy the `DATABASE_URL`.

### 3️⃣ **Apply Migrations and Seed in Railway**
SSH into your **Railway** server and run:
```sh
npx prisma migrate deploy
npm run seed
```

---

## 🛠 Troubleshooting

### ❌ Error: `P3005 - The database schema is not empty`
🔹 Run the following command to resolve:
```sh
npx prisma migrate resolve --applied <MIGRATION_ID>
```

### ❌ Error: `P1002 - Database server timed out`
🔹 Ensure **Railway** is running correctly and try:
```sh
npx prisma db push
```

### ❌ Error on Vercel: `"prisma.seed" property is missing`
🔹 Add this to your `package.json`:
```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

---

## 🏆 Credits
Developed by **[Your Name]**  
🔗 [LinkedIn](https://linkedin.com/in/gabrielpeiteado) | ✉️ gabyypeiteado@gmail.com

---

