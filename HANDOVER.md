# 💅 PolishedByAnshika — Production Handover & Operations Guide

Welcome to the production deployment of **PolishedByAnshika** — a premium e-commerce platform for handmade press-on nails. This document provides everything needed to operate, administer, and maintain the platform.

---

## 🌐 1. Live Web Addresses

| Interface | URL | Access |
|---|---|---|
| **Public Storefront** | `https://polishedbyanshika.com` | Public Customers |
| **Admin Portal** | `https://polishedbyanshika.com/admin` | Store Owner / Admins |
| **API Health Check** | `https://polishedbyanshika.com/api/health` | System Status Monitoring |

---

## 🔑 2. First-Time Setup & Account Connection Checklist

Before going live to real customers, ensure all third-party services in your server's `.env` file are connected to your live business accounts:

### A. Database (MongoDB Atlas)
* **Dashboard**: [cloud.mongodb.com](https://cloud.mongodb.com)
* Go to **Database Access** and create your own dedicated database user.
* Whitelist your EC2 Elastic IP in **Network Access**.
* Update `MONGODB_URI` in `server/.env`.

### B. Media & Image Hosting (Cloudinary)
* **Dashboard**: [console.cloudinary.com](https://console.cloudinary.com)
* Used to store high-resolution nail art photos, customer review images, and homepage banners.
* Copy your **Cloud Name**, **API Key**, and **API Secret** into `server/.env`.

### C. Transactional Emails (Resend)
* **Dashboard**: [resend.com](https://resend.com)
* Go to **Domains** and verify your domain (`polishedbyanshika.com`) by adding the provided DKIM and SPF TXT records in your DNS manager.
* Generate an API Key under **API Keys** and add it as `RESEND_API_KEY` in `server/.env`.
* Set `FROM_EMAIL=orders@polishedbyanshika.com`.

### D. Business WhatsApp & Payment UPI
* Update your business contact number (`BUSINESS_WHATSAPP`) and payment UPI ID (`BUSINESS_UPI`) in `server/.env` or via **Admin Panel > Settings**.
* When customers place orders via UPI, payments are directly sent to this UPI handle, and order status updates trigger direct WhatsApp links.

---

## 🛍️ 3. Store Owner Daily Operations Guide

Access the management dashboard at `/admin` using your administrator account credentials.

### Managing Orders & Tracking Timeline
1. Navigate to **Admin > Orders**.
2. Click on any order to review customer details, selected nail sizes, and delivery addresses.
3. Update the order lifecycle stage as you process the handmade nails:
   * **Pending** &rarr; Order received and awaiting payment verification.
   * **Accepted / Preparing** &rarr; Custom nail set is being handcrafted.
   * **Packed** &rarr; Package is boxed with prep kit and glue.
   * **Shipped** &rarr; Handed over to courier (enter tracking number/link).
   * **Out For Delivery** &rarr; Reached customer's local hub.
   * **Delivered** &rarr; Successfully delivered.
4. *Delivered Experience*: As soon as an order is marked **Delivered**, the customer's order tracking page transforms into a celebration screen, unlocking an invoice download and the **"Write Review"** button.

### Review Moderation
1. Navigate to **Admin > Reviews**.
2. Customers who purchased delivered items can submit 1–5 star reviews with up to 4 photos.
3. Submitted reviews enter a **Pending** moderation queue:
   * Click **Approve** to publish the review on the public product page with a **"Verified Purchase"** badge.
   * Click **Reject** or **Delete** if a review violates store guidelines.
4. Product average star ratings and review counters recalculate automatically.

### Adding & Editing Nail Art Products
1. Navigate to **Admin > Products**.
2. Click **Add Product** to upload up to 5 high-res photos, set base prices, category tags, available shapes (Almond, Coffin, Square, Oval), and size options (XS, S, M, L, or Custom sizes).
3. Toggle stock availability whenever a design is temporarily paused.

---

## 🛠️ 4. Server Maintenance & Fast Deployments

The application is deployed on an **AWS EC2 Ubuntu** instance running an automated **PM2 Cluster** and an **Nginx Reverse Proxy**.

### Deploying Future Code Updates (1-Step Command)
Whenever updates are pushed to GitHub, SSH into your server and run the automated deployment script:
```bash
bash deploy/scripts/deploy.sh
```
This script will automatically:
1. Pull the latest code from `main`.
2. Install production dependencies.
3. Compile the React frontend with Vite.
4. Publish static files to `/var/www/polishedbyanshika/client/dist`.
5. Gracefully reload the backend PM2 cluster with **zero dropped requests**.
6. Verify API health check.

### Useful Server Commands
```bash
# View live API logs
pm2 logs polishedbyanshika-api

# Check server CPU & Memory consumption
pm2 status

# Restart the backend API
pm2 reload polishedbyanshika-api

# Test Nginx web server configuration
sudo nginx -t

# Reload Nginx web server
sudo systemctl reload nginx
```

---

## 📞 Support & Emergency Contact
For infrastructure escalations or technical architecture queries, refer to the project repository's internal issues or contact your engineering team lead.

