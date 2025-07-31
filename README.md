https://refat-pasha.github.io/Inventory-Management-System/
# 📦 Inventory Management System

A comprehensive, full-stack inventory management solution with a modern web interface and robust backend database. Built with Python Flask and vanilla JavaScript for optimal performance and easy deployment.

## 🌟 Live Demo

**🔗 [View Live Application](https://refat-pasha.github.io/Inventory-Management-System/)**

---

## 🚀 Features

### 📊 **Dashboard & Analytics**
- **Real-time statistics** - Total products, inventory value, low stock alerts
- **Interactive charts** - Inventory distribution and stock level visualization
- **Recent activity tracking** - Monitor all inventory transactions
- **Key performance metrics** - Comprehensive business insights

### 📦 **Product Management**
- **Complete CRUD operations** - Add, edit, delete, and view products
- **SKU management** - Automatic SKU generation and validation
- **Category organization** - Organize products by categories
- **Stock level monitoring** - Reorder level alerts and notifications
- **Supplier tracking** - Link products to suppliers

### 🏢 **Supplier Management**
- **Supplier database** - Maintain detailed supplier information
- **Contact management** - Store contact persons, emails, and phone numbers
- **Address tracking** - Complete supplier address information
- **Product relationships** - View all products from each supplier

### 💰 **Transaction Management**
- **Stock in/out tracking** - Monitor inventory movements
- **Automatic quantity updates** - Real-time stock level adjustments
- **Transaction history** - Complete audit trail of all movements
- **Price tracking** - Monitor cost fluctuations
- **Notes and references** - Add context to transactions

### 📈 **Reporting System**
- **Inventory reports** - Complete stock valuation and analysis
- **Low stock alerts** - Identify items needing reorder
- **Supplier reports** - Analyze supplier performance
- **Transaction reports** - Financial and movement analysis

### 🎨 **Modern UI/UX**
- **Responsive design** - Works on desktop, tablet, and mobile
- **Dark/Light theme** - Automatic theme switching
- **Real-time updates** - Dynamic content without page refresh
- **Search and filtering** - Quick data access and organization
- **Interactive modals** - Seamless data entry experience

---

## 🛠️ Technology Stack

### **Backend**
- **Python Flask** - Lightweight web framework
- **SQLAlchemy** - Database ORM and management
- **SQLite** - Embedded database for easy deployment
- **Flask-CORS** - Cross-origin resource sharing
- **RESTful API** - Clean API architecture

### **Frontend**
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Interactive data visualization
- **Responsive Grid** - Mobile-first design approach

### **Database Schema**
- **Products** - SKU, name, category, price, quantity, reorder levels
- **Suppliers** - Contact information and address details
- **Transactions** - Stock movements with full audit trail
- **Categories** - Product categorization system
- **Users** - Multi-user support (ready for expansion)

---

## 📁 Project Structure

Inventory-Management-System/
├── app.py # Flask backend application
├── init_db.py # Database initialization script
├── index.html # Main frontend interface
├── app.js # Frontend JavaScript logic
├── style.css # Responsive CSS styling
├── instance/ # Database storage directory
├── pycache/ # Python cache files
├── .vscode/ # VS Code configuration
├── .gitattributes # Git configuration
└── README.md # Project documentation


---

## 🚀 Getting Started

### **Prerequisites**
- Python 3.7+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of Python and web development

### **Installation & Setup**

1. **Clone the repository**
git clone https://github.com/refat-pasha/Inventory-Management-System.git
cd Inventory-Management-System

2. **Install Python dependencies**
   pip install flask flask-sqlalchemy flask-cors

3. **Initialize the database**
   python init_db.py

   
4. **Run the Flask backend**
   python app.py


5. **Access the application**
- Backend API: `http://localhost:5000`
- Frontend Interface: Open `index.html` in your browser
- Or use the live demo: [https://refat-pasha.github.io/Inventory-Management-System/](https://refat-pasha.github.io/Inventory-Management-System/)

---

## 🖥️ Usage Guide

### **Dashboard Overview**
- View key metrics and statistics at a glance
- Monitor inventory distribution with interactive charts
- Track recent transactions and activities
- Identify low stock items requiring attention

### **Managing Products**
1. Click **"Add Product"** to create new inventory items
2. Fill in product details: SKU, name, category, price, quantity
3. Set reorder levels for automatic low stock alerts
4. Assign suppliers for better inventory tracking

### **Managing Suppliers**
1. Navigate to **"Suppliers"** section
2. Add supplier contact information and addresses
3. Link products to suppliers for better organization
4. Track supplier performance and relationships

### **Recording Transactions**
1. Go to **"Transactions"** module
2. Select product and transaction type (Stock In/Out)
3. Enter quantity and unit price
4. Add notes for reference and audit trail

### **Generating Reports**
1. Access **"Reports"** section
2. Choose report type: Inventory, Low Stock, Supplier, or Transaction
3. View comprehensive analysis and insights
4. Export data for external use (future enhancement)

---

## 🔧 API Endpoints

### **Products**
- `GET /api/products` - Retrieve all products
- `POST /api/products` - Create new product
- `PUT /api/products/<id>` - Update existing product
- `DELETE /api/products/<id>` - Delete product

### **Suppliers**
- `GET /api/suppliers` - Retrieve all suppliers
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/<id>` - Update supplier information
- `DELETE /api/suppliers/<id>` - Delete supplier

### **Transactions**
- `GET /api/transactions` - Retrieve transaction history
- `POST /api/transactions` - Record new transaction

### **Reports & Analytics**
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/reports/low-stock` - Low stock report
- `GET /api/reports/stock-valuation` - Stock valuation report

---

## 🎨 Design Features

### **Responsive Layout**
- **Mobile-first approach** - Optimized for all screen sizes
- **Flexible grid system** - Adapts to different devices
- **Touch-friendly interface** - Mobile gesture support

### **Modern Aesthetics**
- **Clean typography** - Professional font choices
- **Consistent color scheme** - Brand-aligned palette
- **Smooth animations** - Enhanced user experience
- **Loading states** - User feedback during operations

### **Accessibility**
- **Keyboard navigation** - Full keyboard support
- **Screen reader friendly** - Proper ARIA labels
- **High contrast** - Readable text and UI elements
- **Focus indicators** - Clear navigation cues

---

## 🔄 Future Enhancements

### **Phase 1: Core Improvements**
- [ ] User authentication and authorization system
- [ ] Email notifications for low stock alerts
- [ ] Barcode scanning integration
- [ ] CSV/Excel import/export functionality

### **Phase 2: Advanced Features**
- [ ] Multi-location inventory tracking
- [ ] Purchase order management
- [ ] Sales order processing
- [ ] Advanced analytics dashboard

### **Phase 3: Integration & Scaling**
- [ ] Third-party API integrations (accounting software)
- [ ] Mobile app development
- [ ] Cloud deployment options
- [ ] Multi-tenant support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

### **How to Contribute**
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/new-feature`)
3. **Commit your changes** (`git commit -am 'Add some feature'`)
4. **Push to the branch** (`git push origin feature/new-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow Python PEP 8 style guidelines
- Use semantic HTML and CSS best practices
- Write clear, documented JavaScript code
- Test all functionality before submitting

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Refat Pasha**
- **Portfolio**: [refatpasha.github.io/protfolio](https://refatpasha.github.io/protfolio/)
- **GitHub**: [@refat-pasha](https://github.com/refat-pasha)
- **Email**: refatpasha567@gmail.com

---

## 🙏 Acknowledgments

- **Flask Community** for the excellent web framework
- **Chart.js** for beautiful data visualization
- **SQLAlchemy** for robust database management
- **Open Source Community** for inspiration and resources

---

## 📊 Project Stats

![Languages](https://img.shields.io/badge/Languages-Python%20%7C%20JavaScript%20%7C%20HTML%20%7C%20CSS-blue)
![Framework](https://img.shields.io/badge/Framework-Flask-green)
![Database](https://img.shields.io/badge/Database-SQLite-orange)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

**⭐ If you found this project helpful, please consider giving it a star!**

*Last updated: July 2025*
