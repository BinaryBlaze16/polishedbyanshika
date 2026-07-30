# 💅 PolishedByAnshika — Press-On Nail Art E-Commerce Platform

> Premium handcrafted press-on nail art e-commerce + admin platform. Full-stack, production-ready, free-tier deployable.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS v3 + Zustand + React Router v6 |
| **Backend** | Node.js + Express.js + JWT + Bcrypt |
| **Database** | MongoDB + Mongoose |
| **Images** | Cloudinary SDK |
| **Email** | Resend API |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas URI)

### 1. Clone & Navigate
```bash
cd /path/to/project
```

### 2. Start Backend
```bash
cd server
cp .env.example .env    # Edit with your MongoDB URI & keys
npm install
npm run seed            # Seeds admin account + demo products
npm run dev             # Starts on http://localhost:5000
```

### 3. Start Frontend
```bash
cd client
npm install
npm run dev             # Starts on http://localhost:5173
```

---

## 👤 Admin Account (Pre-seeded)

| Field | Value |
|---|---|
| Email | `admin@polishedbyanshika.com` |
| Password | `Anshika@#6394802184` |
| Role | Admin |

> ⚠️ Change the password after your first login in production!

---

## 🔑 Required Environment Variables (server/.env)

```env
MONGODB_URI=mongodb+srv://...        # MongoDB Atlas connection string
JWT_SECRET=your_secret_key           # Random strong secret
CLOUDINARY_CLOUD_NAME=...            # From cloudinary.com
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=re_...                # From resend.com (optional)
CLIENT_URL=https://your-vercel-app.vercel.app
```

---

## 🆓 Free Service Setup Links

| Service | What to do | Link |
|---|---|---|
| **MongoDB Atlas** | Create free cluster → get connection string | [atlas.mongodb.com](https://atlas.mongodb.com) |
| **Cloudinary** | Create free account → copy API keys | [cloudinary.com](https://cloudinary.com) |
| **Resend** | Create free account → create API key | [resend.com](https://resend.com) |
| **Vercel** | Connect GitHub → import client folder | [vercel.com](https://vercel.com) |
| **Render** | Connect GitHub → import server folder | [render.com](https://render.com) |

---

## 📦 Project Structure

```
react/
├── server/                     # Express.js Backend
│   ├── config/                 # db.js, cloudinary.js, email.js
│   ├── controllers/            # Business logic
│   ├── middleware/             # Auth, error, upload, rate limit
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── utils/                  # Token gen, email, cloudinary, seed
│   ├── .env.example
│   └── server.js
└── client/                     # React Frontend
    ├── src/
    │   ├── components/         # Navbar, Footer, Cards, Modals
    │   ├── pages/              # Home, Shop, Product, Cart, Checkout...
    │   │   └── admin/          # Full admin dashboard pages
    │   ├── store/              # Zustand stores
    │   ├── services/           # API service functions
    │   └── utils/              # Helpers
    └── tailwind.config.js
```

---

## 🌐 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import `client/` folder in Vercel
3. Add env var: `VITE_API_URL=https://your-render-app.onrender.com/api`
4. Deploy ✅

### Backend → Render
1. Push to GitHub  
2. New Web Service → select repo, root = `server/`
3. Build cmd: `npm install`, Start cmd: `npm start`
4. Add all env vars from `.env.example`
5. Deploy ✅

---

## 💳 UPI Payment Flow

1. Customer adds to cart → checkout → selects **UPI Manual**
2. QR code shown with `polishedbyanshika@upi`
3. Customer pays → enters UTR transaction ID
4. **Admin Dashboard → Orders → Verify Payment** → 1-click approve
5. Order status updates to **Accepted** → email notification sent

---

## 📱 WhatsApp Integration

- Custom order requests auto-generate WhatsApp message
- Link format: `https://wa.me/916394802184?text=...`
- Admin gets notified via WhatsApp for urgent orders

---

*Built with 💅 for PolishedByAnshika nail art business*
