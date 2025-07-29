# Fayda Visitor Access System

A comprehensive visitor management system for secure facilities using **Fayda ID authentication** and **VeriFayda 2.0 (eSignet) OIDC integration**.

## 🏗️ Architecture

- **Frontend**: Vanilla HTML, CSS, JavaScript (deployed on Vercel)
- **Backend**: Django REST API (deployed on Render)
- **Authentication**: VeriFayda 2.0 (eSignet) OIDC with PKCE flow
- **Database**: SQLite (development) / PostgreSQL (production)

## 🚀 Features

### Core Functionality
- **Visitor Check-In**: Fayda ID authentication with VeriFayda 2.0 OIDC
- **Visitor Check-Out**: Quick checkout process with visit duration tracking
- **Admin Dashboard**: Real-time statistics, visitor logs, and reporting
- **Host Management**: Add/edit people who can receive visitors

### Security Features
- OIDC Authorization Code Flow with PKCE
- JWT client assertion with RS256 signing using JWK private key
- Secure session management with expiration
- CORS protection and CSRF mitigation

### User Experience
- Responsive design for tablet/kiosk displays
- Accessible HTML5 with ARIA support
- Professional government-style UI
- Real-time form validation
- Multi-language support (English/Amharic)

## 📁 Project Structure

\`\`\`
fayda-visitor-system/
├── frontend/                 # Vercel deployment
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   ├── checkin.js       # Check-in functionality
│   │   ├── checkout.js      # Check-out functionality
│   │   ├── dashboard.js     # Admin dashboard
│   │   ├── hosts.js         # Host management
│   │   └── login.js         # Authentication
│   ├── assets/
│   │   └── logo.svg         # System logo
│   ├── index.html           # Landing page
│   ├── checkin.html         # Visitor check-in
│   ├── checkout.html        # Visitor check-out
│   ├── dashboard.html       # Admin dashboard
│   ├── hosts.html           # Host management
│   └── login.html           # Login page
└── backend/                 # Render deployment
    ├── visitor_system/      # Django project
    │   ├── settings.py      # Configuration
    │   ├── urls.py          # URL routing
    │   └── wsgi.py          # WSGI application
    ├── visitor_app/         # Main application
    │   ├── models.py        # Database models
    │   ├── views.py         # API endpoints
    │   ├── serializers.py   # Data serialization
    │   ├── oidc.py          # VeriFayda integration
    │   ├── urls.py          # App URL routing
    │   └── admin.py         # Admin interface
    ├── requirements.txt     # Python dependencies
    ├── Dockerfile          # Docker configuration
    ├── docker-compose.yml  # Local development
    └── manage.py           # Django management
\`\`\`

## 🛠️ Installation and Deployment

### Prerequisites
- Python 3.11+
- Docker and Docker Compose
- VeriFayda 2.0 (eSignet) OIDC credentials
- Git

### Backend Setup (Local Development)

1. **Clone the repository**:
   \`\`\`bash
   git clone <your-repo-url>
   cd fayda-visitor-system/backend
   \`\`\`

2. **Create virtual environment**:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. **Install dependencies**:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Environment configuration**:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your VeriFayda credentials (see configuration section below)
   \`\`\`

5. **Database setup**:
   \`\`\`bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   \`\`\`

6. **Run development server**:
   \`\`\`bash
   python manage.py runserver
   \`\`\`

   The API will be available at `http://localhost:8000/api/`

### Frontend Setup (Local Development)

1. **Navigate to frontend directory**:
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Update API endpoints** (if needed):
   - Edit JavaScript files to point to your backend URL
   - For local development, the default `http://localhost:8000/api` should work

3. **Serve locally using Python**:
   \`\`\`bash
   python -m http.server 8080
   \`\`\`

   The frontend will be available at `http://localhost:8080`

### Docker Deployment (Recommended)

1. **Navigate to backend directory**:
   \`\`\`bash
   cd backend
   \`\`\`

2. **Create environment file**:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Build and run with Docker Compose**:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

4. **Run database migrations**:
   \`\`\`bash
   docker-compose exec web python manage.py migrate
   docker-compose exec web python manage.py createsuperuser
   \`\`\`

5. **Access the application**:
   - Backend API: `http://localhost:8000/api/`
   - Admin Interface: `http://localhost:8000/admin/`

### Production Deployment

#### Frontend (Vercel)

1. **Connect repository to Vercel**
2. **Set build settings**:
   - Build Command: (leave empty)
   - Output Directory: `frontend`
   - Install Command: (leave empty)
   - Root Directory: `frontend`

3. **Environment variables** (optional):
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

#### Backend (Render)

1. **Create new Web Service on Render**
2. **Configuration**:
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start Command: `gunicorn visitor_system.wsgi:application`
   - Environment: Python 3.11
   - Root Directory: `backend`

3. **Environment variables** (see configuration section below)

## 🔧 Configuration

### VeriFayda 2.0 (eSignet) OIDC Setup

The system is pre-configured with test credentials for the VeriFayda staging environment:

\`\`\`env
CLIENT_ID=GCE-a3iRabzdfqh17DH8LaxhhZKvtarwHc1X3H6mn1k
REDIRECT_URI=https://your-frontend.vercel.app/checkin.html
AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
\`\`\`

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

\`\`\`env
# Django Configuration
DJANGO_SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-backend-domain.onrender.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,https://your-frontend.vercel.app

# VeriFayda 2.0 (eSignet) OIDC Configuration
CLIENT_ID=GCE-a3iRabzdfqh17DH8LaxhhZKvtarwHc1X3H6mn1k
REDIRECT_URI=https://your-frontend.vercel.app/checkin.html
PRIVATE_KEY_JWK=ewogICJrdHkiOiAiUlNBIiwKICAidXNlIjogInNpZyIsCiAgImtleV9vcHMiOiBbCiAgICAic2lnbiIKICBdLAogICJhbGciOiAiUlMyNTYiLAogICJraWQiOiAiMGIxOTRkZjQtNzE0OS00MTQ2LTk3YzUtNzhmZGYwZDRmYjFkIiwKICAiZCI6ICJhcFhneVlZSno3RUdZdGQ4bVF6dXgxMl90d2RfdHdUY1pwSzJnRzhUd29MYlVkX0dmc3J2VXlUYzYyUk1EdU43d0RIbHFyWWVQTHBtS25LWDJKYjE5U1hFa1Nvanp0c3dSOF9EdVYwTE9QZkpQb3JPVTd3MFdLMHJjX3pXM3VURTJ3Ti01Nm5DQnhLcE41ZnZSWDRyYkhsazlFSTZFNTRtS1VWUzl6T3pQdGRiTjc3OEY2U3haMl9kc2FTQUhKMzZqWlpRUFRUdmZRb0Z5UzlzSTJOVDlkbGpvVm1PMk1xVEZ2ZG5VY0RQWng4ajFIQzFmWWNFU2NsV2VURFNpRWFuX293RE9UVjdPLXFCb2h3N0pGd2tScTNVeC1oSjFKMHdlaEJsbGZVVnB3cjI1aElxNXBKUlF4cnZucVU3SHdqU2xuSmpfQjFLSFdCdk9WOUdyUUZfWFEiLAogICJuIjogIjRPd0s1SEk2QVFtS3ZkeGt5S29xX1d1UFcyVl9vcWtaNkVjSDZSQjd5bVJ3cDhteXFRVFR4LVlfejcwZ3Z6d1o1YUNyQ0JqVi10WThXckk1cDBENjg3aEFEbDEtQ2ttTHFHQjVCR016bXd3c0wzYS1lZlhOMVBXSFBhR3FYR0IxUDBueGl3TVJaMTZKcHhOSWtqWGdOajcyd0tob2VKVEFpVUpGbWE5RFdyQ2FxMlJ1ZWVDWWVKNnBqVmdYcEpWNUtOMzFFQUhoRHZMUDZEbk4zd3h6NnlOcTBBNjBQeFRLcmpHdzhUYzlqN18tT3pwSUV1Y3A2T3p0ZEg0c2o0QURSRWtBUWtYNktZV0c1SE9nWldyUWpaemF1MDlPOEVsa2hPZDFNdE9zVEZiRmdyTXBkamR1OFdoSGprVlp6Yk5hd0IwNFBra3Q2VkYtNU5EMktGWWx6dyIsCiAgImUiOiAiQVFBQiIsCiAgInAiOiAiLVB3R01xTzU1TjNwcmFGTjhrNmdmSEhEajBpRllQS3BvNVpBN1JqNEpZQmpybmlEcXJnN1ItaE53NlhFM2tXQ1hJNjZXLXI2aVFrb186SE9uU3IyZW0wTjU2Rm9zY3ZXMFhhSG5CbkRkQXVHUm9LUDQzcW16OG5zeDJTWjlKZmZNN0o1QjFvODk1RmhUTHA4ZXFLTkVlS3BpV3Y2bGR4M0txSFZnOGZqN0cwIiwKICAicSI6ICI1MEp6ZldBNlhueFJHQVN6Z21jaGI3V1JINTlmenhWSmt3ajNTZF9EMFlJOEVNLUFwanlIOG1tTU5fZVZ5cEhTcmJFSFo5cHJTTVVjUmZxRC1TUlNpT1NFd1BoVmJ3Zmc3X0VQeE5YeDVkOGxxZ0dOUUNyNVBEWGRCd2lYMEt3TXlpcXBNMEM2YWtYX2lfMmRmWlRFb2VkMmx0RlhIcFp1MDZKOGNBZC1mYXMiLAogICJkcCI6ICJ4SGNSYU9uNmFGYVc2bFFLem5VdWU2UEZIUTJyZVZsaGRGeS1kSmdzVG1NbHhPa0JkRGVWUjJOTjRXQ3ZuSGdhcW5CUkt2Q2Fxb0VZNFcxcXpHZTNQOWxIakl1M3NmdlhVVWNITUt5X3BwVGxha1BoeUN6aTdiazI1Z3RDMUZiMlg3T25mcDY4MXRqWGZ4VHoza3pmcGNwRjN0TGVVMXc0aC1KVk9Yd0VKRzAiLAogICJkcSI6ICJpX3lPbWt0QXFlZEkwMmd0SFhlLUpyZmF4RENlTjJWa1p3dmJYUzJGaEhINFdCaXpnRzFOd2JDZ2YxUndxUEdDZlQtWEF3ZVZQN1NKZTlhOFFuajVPUUpUVmRnOUp2dTI3cWVXYXdreTUzb2ZlM3g2LTJmSF9PbUNCUHJ2b3hJeW44SVpMX3d6bTVjSnJMejFzNG4xU1NncWdmcndhSVNaUzZTa19NLWNnd2MiLAogICJxaSI6ICJVbjZwWVZDMTZJZk5FLVlhaUtjNmZFRTZkZnZZWm4xOWdOb2JERmI2VFcxV1A0T0xac3IzdlVYREptajNfYm0yR19QOVNGbGdzNWZ6UUpLUDd5RTdDTjNlWmxmaHMzUE8tc3NWbDZrSGg1dTVtLWp2Q0R1OGo1VFl5c3FvRXFIV3RqMUI1VGNzSGxvOWkwTFl5dThkT3ViV1cxa0pmSWtteXFyb3pSa0NhZEkiCn0=
TOKEN_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token
AUTHORIZATION_ENDPOINT=https://esignet.ida.fayda.et/authorize
USERINFO_ENDPOINT=https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo
CLIENT_ASSERTION_TYPE=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
\`\`\`

### Test Credentials

For testing with VeriFayda staging environment:

- **Test FAN**: 3126894653473958
- **Test FIN**: 6140798523917519  
- **Test FIN3**: 6230247319356120
- **OTP**: 111111

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login/` - Basic login (stub)
- `POST /api/oidc/initiate/` - Initiate VeriFayda OIDC flow
- `POST /api/oidc/callback/` - Handle VeriFayda OIDC callback

### Visitor Management
- `POST /api/checkin/` - Check in visitor
- `POST /api/checkout/find-active/` - Find active visit
- `POST /api/checkout/` - Check out visitor
- `POST /api/checkout/force/` - Force checkout (admin)

### Host Management
- `GET /api/hosts/` - List hosts
- `POST /api/hosts/` - Create host
- `GET /api/hosts/{id}/` - Get host details
- `PUT /api/hosts/{id}/` - Update host
- `DELETE /api/hosts/{id}/` - Delete host

### Dashboard & Reporting
- `GET /api/dashboard/stats/` - Get dashboard statistics
- `GET /api/visitor-logs/` - List visitor logs (with filtering)
- `GET /api/visitor-logs/export/` - Export logs as CSV

## 🔐 Security Features

### VeriFayda 2.0 Integration
- **Authorization Code Flow with PKCE**: Enhanced security for code exchange
- **Client Assertion**: JWT signed with RS256 using JWK private key
- **State Parameter**: CSRF protection during OAuth flow
- **Multi-language Support**: English and Amharic claims
- **Essential Claims**: Mandatory fields for visitor verification

### Production Security
- HTTPS enforcement
- CORS protection
- JWT signature verification
- Secure session management
- Input validation and sanitization

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
python manage.py test
\`\`\`

### Manual Testing Flow

1. **Start the application**:
   \`\`\`bash
   docker-compose up
   \`\`\`

2. **Test visitor check-in**:
   - Navigate to check-in page
   - Enter test FAN: `3126894653473958`
   - Complete VeriFayda authentication
   - Verify visitor information display
   - Complete check-in process

3. **Test admin dashboard**:
   - Access admin interface at `/admin/`
   - View visitor logs and statistics
   - Test host management features

## 🐛 Troubleshooting

### Common Issues

1. **VeriFayda Authentication Fails**:
   - Verify CLIENT_ID and endpoints are correct
   - Check private key JWK format
   - Ensure redirect URI matches exactly
   - Check network connectivity to VeriFayda endpoints

2. **CORS Errors**:
   - Update `CORS_ALLOWED_ORIGINS` in settings
   - Verify frontend domain is included
   - Check protocol (HTTP vs HTTPS)

3. **Docker Issues**:
   - Ensure Docker and Docker Compose are installed
   - Check port availability (8000, 5432)
   - Verify environment variables are set

4. **Database Connection Issues**:
   - Check database credentials
   - Ensure database server is running
   - Verify network connectivity

### Logs and Monitoring

- **Backend logs**: Check Django logs in container or `/app/visitor_system.log`
- **Frontend errors**: Use browser developer console
- **API monitoring**: Use Django admin interface
- **VeriFayda integration**: Check network tab for OIDC requests

## 📈 Performance Considerations

- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching for dashboard statistics
- Optimized queries with select_related
- Static file compression with WhiteNoise

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Check the troubleshooting guide above
- Review VeriFayda integration documentation

---

**Built with ❤️ for secure visitor management using VeriFayda 2.0**
