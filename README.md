# Trustshield
contains API for BET hackathon

# TrustShield: Real-Time Payment Security for South Africa  
**Stop fraud at the source. Turn evidence into action. Protect every Rand.**  

[![Demo Video]([https://img.shields.io/badge/DEMO-VIDEO-ff0000?style=for-the-badge)](https://youtu.be/dQw4w9WgXcQ)](https://docs.google.com/presentation/d/1R3a72kaofB4my4rPROoQPS_TI-BPEkCLmh6slsoJHqw/edit?usp=sharing)
[![Live Demo](https://trustshield.netlify.app/) 
[![Pitch Deck](https://docs.google.com/presentation/d/1R3a72kaofB4my4rPROoQPS_TI-BPEkCLmh6slsoJHqw/edit?usp=sharing)

## 🛡️ The Crisis  
**R740 million** was stolen from South Africans through payment fraud in 2023. Scams like:  
- Fake tender deposits 💸  
- Tap-to-pay theft 📱  
- Unregistered merchant fraud 🏢  

Current solutions are **slow, reactive, and fail ordinary citizens** when they need protection most.

## ⚡ The Solution  
TrustShield is a real-time security layer that:  
1. ✅ **Verifies merchants** against CIPC data + watchlists  
2. ⚠️ **Scores risk** using lightweight AI in <300ms  
3. 🛑 **Blocks suspicious payments** before money leaves  
4. 📄 **Generates court-ready evidence** for SAPS  

**Demo Impact**: Watch us save Thandi's R15,000 pension from a fake tender scam in under 10 seconds → [Demo Video](https://youtu.be/dQw4w9WgXcQ)

## 🚀 Getting Started (Judges & Developers)

### Prerequisites
- Node.js v18+
- npm

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/trustshield.git
cd trustshield

# Install dependencies
cd frontend && npm install
cd ../backend && npm install
```

### Running Locally
```bash
# Start backend (API server)
cd backend
npm start

# Start frontend (React app)
cd ../frontend
npm start
```

Visit `http://localhost:3000` to access the demo interface.

## 🧪 Testing the Demo Flow  
Experience our golden path in 30 seconds:  
1. Visit [Live Demo](https://trustshield-demo.vercel.app)  
2. Click **"FRAUD DEMO"** button  
3. See 88% risk score with triggers  
4. Click **"BLOCK PAYMENT"**  
5. View/download SAPS fraud packet  

[![Demo Screenshot](https://via.placeholder.com/800x400?text=TrustShield+Demo+Screenshot+Payment+→+Risk+→+Block+→+Evidence)](frontend/public/screenshot.png)

## 🧠 Technical Architecture  
```mermaid
graph LR
A[User Payment] --> B(Frontend)
B --> C[/verify API]
C --> D{CIPC Data}
B --> E[/score API]
E --> F[AI Rules Engine]
B --> G[/block API]
G --> H[Generate PDF]
G --> I[Log to Polygon]
```

**Tech Stack**:  
- **Frontend**: React, Vite  
- **Backend**: Node.js, Express  
- **Security**: Rule-based AI, Polygon blockchain  
- **Deployment**: Vercel + Render  

## 📁 Project Structure  
```
trustshield/
├── frontend/             # React demo interface
├── backend/              # Node.js API endpoints
├── docs/                 # Pitch assets
│   ├── TrustShield_Pitch_Deck.pdf
│   ├── Demo_Video.mp4
│   └── Fraud_Packet_Sample.pdf
└── README.md
```

## 🌍 Why South Africa Needs This  
- **Prevents irreversible theft** at point-of-payment  
- **Accelerates SAPS prosecutions** with digital evidence  
- **Protects vulnerable groups**: Pensioners, SMMEs, grant recipients  
- **Integrates seamlessly** with existing banking infrastructure  

## 🚀 Next Steps  
We're seeking:  
- Banking/payment processor partnerships  
- SAPS evidence format collaboration  
- Pilot deployment funding  

**Let's make R740 million in losses history together.**

---

**Built in 24 hours for the [BET Hackathon] by Team TrustShield**  
[Contact Us](mailto:team@trustshield.za) | [Issue Tracker](https://github.com/infrixxx/trustshield/issues)
