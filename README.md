# Rohini Graphics - Fullstack Next.js (React) & MongoDB Atlas Web Application

This is a premium, full-stack **Next.js (App Router)** web application created for **Rohini Graphics** (premium signboard manufacturing and branding based in Surat, Gujarat). It migrates our initial static design into a robust react structure powered by **MongoDB Atlas** for database persistence.

---

## 🚀 Key Migration Upgrades

1. **Fullstack Next.js Architecture**:
   - Organized pages using React and modular states (Home, Dynamic Catalog, Quote Form, Admin Dashboard).
   - Componentized shared layers like the Navigation Header (handling theme swappers) and Footer.

2. **MongoDB Atlas Integration**:
   - Form entries are no longer sandboxed inside a single browser's `localStorage`! They write directly to a cloud cluster in MongoDB.
   - Built a secure data schema mapping customer phone numbers, budget categories, urgency, and private admin follow-up notes.

3. **Serverless API Routes**:
   - `POST /api/inquiries`: Receives customer inquiries and submits them securely to MongoDB.
   - `GET /api/inquiries`: Loads inquiries for the admin dashboard, sorting by date and allowing live searching/filtering.
   - `PATCH /api/inquiries/[id]`: Triggers updates to customer statuses or follow-up notes from the details modal.
   - `POST /api/seed`: Instantly clears your collection and seeds 5 realistic sample inquiries for immediate testing.

---

## 🛠️ Step-by-Step Setup Guide

To run this full-stack Next.js web application locally, please follow this step-by-step guide:

### Step 1: Install Node.js
If Node.js is not already installed on your Windows machine, open a command line (PowerShell or Command Prompt) and run:
```powershell
winget install OpenJS.NodeJS
```
*Note: Restart your terminal after installation so the `node` and `npm` command paths are recognized.*
Alternative: Download the standard LTS installer from [nodejs.org](https://nodejs.org/).

### Step 2: Set Up MongoDB Atlas (Cloud Database)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. Create a new **Shared (Free) Database Cluster** named `rohinigraphics`.
3. In **Database Access**, create a user named `admin` with a password (e.g., `admin123`).
4. In **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (0.0.0.0/0)** so your local development environment can communicate.
5. In the Cluster dashboard, click **Connect** -> **Drivers** (Node.js) and copy your **Connection String**. It looks like this:
   `mongodb+srv://admin:<password>@cluster0.xxxx.mongodb.net/rohinigraphics?retryWrites=true&w=majority`

### Step 3: Configure Environment Variables
Open the [.env.local](file:///c:/Users/Prashant/Desktop/rohinigraphics/.env.local) file in your project directory and swap in your connection string:
- Replace `<password>` with your database user password.
- Save the file.

```env
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxx.mongodb.net/rohinigraphics?retryWrites=true&w=majority
ADMIN_PIN=admin123
```

### Step 4: Install Dependencies & Run
Open your terminal in the `c:\Users\Prashant\Desktop\rohinigraphics` directory and run:

```bash
# 1. Install all dependencies (Next.js, React, React-Dom, Mongoose, MongoDB)
npm install

# 2. Run the development server
npm run dev
```

Open your browser and navigate to: **`http://localhost:3000`**

---

## 🔑 Administrative Access

- **Admin Page URL**: Navigate to `http://localhost:3000/admin` (or click **Admin Panel** in the header).
- **Access security PIN**: **`admin123`**
- **Test Seeding**: Click **"Seed Atlas Data"** in your authenticated dashboard. Next.js will connect to your MongoDB Atlas cluster, clear any old entries, insert 5 rich mock database inquiries, and fetch them live to populate your metrics and tables!
