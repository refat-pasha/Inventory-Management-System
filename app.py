from flask import Flask, request, jsonify, render_template_string
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

db = SQLAlchemy(app)
CORS(app)

# Database Models
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    reorder_level = db.Column(db.Integer, nullable=False, default=0)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'sku': self.sku,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'price': self.price,
            'quantity': self.quantity,
            'reorder_level': self.reorder_level,
            'supplier_id': self.supplier_id,
            'supplier': self.supplier.name if self.supplier else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    products = db.relationship('Product', backref='supplier', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_person': self.contact_person,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False)  # 'in', 'out', 'transfer', 'adjustment'
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    notes = db.Column(db.Text)
    user_id = db.Column(db.Integer, default=1)  # For future user management
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship('Product', backref='transactions')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'transaction_type': self.transaction_type,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price,
            'notes': self.notes,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat()
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# API Routes

# Product Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([product.to_dict() for product in products])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify(product.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        
        # Validation
        required_fields = ['sku', 'name', 'category', 'price', 'quantity', 'reorder_level', 'supplier_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Check if SKU already exists
        if Product.query.filter_by(sku=data['sku']).first():
            return jsonify({'error': 'SKU already exists'}), 400

        product = Product(
            sku=data['sku'],
            name=data['name'],
            description=data.get('description', ''),
            category=data['category'],
            price=float(data['price']),
            quantity=int(data['quantity']),
            reorder_level=int(data['reorder_level']),
            supplier_id=int(data['supplier_id'])
        )

        db.session.add(product)
        db.session.commit()

        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()

        # Update fields
        if 'sku' in data:
            # Check if new SKU already exists (excluding current product)
            existing = Product.query.filter(Product.sku == data['sku'], Product.id != product_id).first()
            if existing:
                return jsonify({'error': 'SKU already exists'}), 400
            product.sku = data['sku']
        
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'category' in data:
            product.category = data['category']
        if 'price' in data:
            product.price = float(data['price'])
        if 'quantity' in data:
            product.quantity = int(data['quantity'])
        if 'reorder_level' in data:
            product.reorder_level = int(data['reorder_level'])
        if 'supplier_id' in data:
            product.supplier_id = int(data['supplier_id'])

        product.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify(product.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Supplier Routes
@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    try:
        suppliers = Supplier.query.all()
        return jsonify([supplier.to_dict() for supplier in suppliers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/suppliers/<int:supplier_id>', methods=['GET'])
def get_supplier(supplier_id):
    try:
        supplier = Supplier.query.get_or_404(supplier_id)
        return jsonify(supplier.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/suppliers', methods=['POST'])
def create_supplier():
    try:
        data = request.get_json()
        
        # Validation
        required_fields = ['name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        supplier = Supplier(
            name=data['name'],
            contact_person=data.get('contact_person', ''),
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )

        db.session.add(supplier)
        db.session.commit()

        return jsonify(supplier.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/suppliers/<int:supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    try:
        supplier = Supplier.query.get_or_404(supplier_id)
        data = request.get_json()

        # Update fields
        if 'name' in data:
            supplier.name = data['name']
        if 'contact_person' in data:
            supplier.contact_person = data['contact_person']
        if 'email' in data:
            supplier.email = data['email']
        if 'phone' in data:
            supplier.phone = data['phone']
        if 'address' in data:
            supplier.address = data['address']

        supplier.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify(supplier.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/suppliers/<int:supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    try:
        supplier = Supplier.query.get_or_404(supplier_id)
        # Check if supplier has products
        if supplier.products:
            return jsonify({'error': 'Cannot delete supplier with associated products'}), 400
        
        db.session.delete(supplier)
        db.session.commit()
        return jsonify({'message': 'Supplier deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Transaction Routes
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = Transaction.query.order_by(Transaction.created_at.desc()).all()
        return jsonify([transaction.to_dict() for transaction in transactions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    try:
        data = request.get_json()
        
        # Validation
        required_fields = ['product_id', 'transaction_type', 'quantity', 'unit_price']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        product = Product.query.get_or_404(data['product_id'])
        quantity = int(data['quantity'])
        unit_price = float(data['unit_price'])

        # Update product quantity based on transaction type
        if data['transaction_type'].lower() == 'in':
            product.quantity += quantity
        elif data['transaction_type'].lower() == 'out':
            if product.quantity < quantity:
                return jsonify({'error': 'Insufficient stock'}), 400
            product.quantity -= quantity

        transaction = Transaction(
            product_id=data['product_id'],
            transaction_type=data['transaction_type'],
            quantity=quantity,
            unit_price=unit_price,
            total_price=quantity * unit_price,
            notes=data.get('notes', ''),
            user_id=data.get('user_id', 1)
        )

        db.session.add(transaction)
        db.session.commit()

        return jsonify(transaction.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Category Routes
@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([category.to_dict() for category in categories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['POST'])
def create_category():
    try:
        data = request.get_json()
        
        if 'name' not in data:
            return jsonify({'error': 'Missing required field: name'}), 400

        category = Category(
            name=data['name'],
            description=data.get('description', '')
        )

        db.session.add(category)
        db.session.commit()

        return jsonify(category.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Dashboard Routes
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        total_products = Product.query.count()
        total_value = db.session.query(db.func.sum(Product.price * Product.quantity)).scalar() or 0
        low_stock_items = Product.query.filter(Product.quantity <= Product.reorder_level).count()
        out_of_stock = Product.query.filter(Product.quantity == 0).count()
        total_suppliers = Supplier.query.count()
        recent_transactions = Transaction.query.filter(
            Transaction.created_at >= datetime.utcnow().date()
        ).count()

        stats = {
            'total_products': total_products,
            'total_value': float(total_value),
            'low_stock_items': low_stock_items,
            'out_of_stock': out_of_stock,
            'total_suppliers': total_suppliers,
            'recent_transactions': recent_transactions
        }

        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Report Routes
@app.route('/api/reports/low-stock', methods=['GET'])
def get_low_stock_report():
    try:
        products = Product.query.filter(Product.quantity <= Product.reorder_level).all()
        return jsonify([product.to_dict() for product in products])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports/stock-valuation', methods=['GET'])
def get_stock_valuation_report():
    try:
        products = Product.query.all()
        report = []
        for product in products:
            value = product.quantity * product.price
            report.append({
                'product': product.to_dict(),
                'total_value': value
            })
        return jsonify(report)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database
@app.before_request
def create_tables():
    db.create_all()
    
    # Add sample data if tables are empty
    if Supplier.query.count() == 0:
        # Add sample suppliers
        supplier1 = Supplier(
            name="Tech Supplies Inc",
            contact_person="John Smith",
            email="john@techsupplies.com",
            phone="+1-555-0123",
            address="123 Tech Street, Silicon Valley, CA"
        )
        supplier2 = Supplier(
            name="Office Furnishings Co",
            contact_person="Sarah Johnson",
            email="sarah@officefurnishings.com",
            phone="+1-555-0456",
            address="456 Business Ave, New York, NY"
        )
        
        db.session.add(supplier1)
        db.session.add(supplier2)
        db.session.commit()

        # Add sample categories
        categories = [
            Category(name="Electronics", description="Electronic devices and components"),
            Category(name="Furniture", description="Office and home furniture"),
            Category(name="Office Supplies", description="General office supplies")
        ]
        
        for category in categories:
            db.session.add(category)
        db.session.commit()

        # Add sample products
        products = [
            Product(
                sku="PROD-001",
                name="Laptop Computer",
                description="High-performance business laptop",
                category="Electronics",
                price=999.99,
                quantity=25,
                reorder_level=10,
                supplier_id=supplier1.id
            ),
            Product(
                sku="PROD-002",
                name="Office Chair",
                description="Ergonomic office chair with lumbar support",
                category="Furniture",
                price=299.99,
                quantity=15,
                reorder_level=5,
                supplier_id=supplier2.id
            ),
            Product(
                sku="PROD-003",
                name="Wireless Mouse",
                description="Bluetooth wireless optical mouse",
                category="Electronics",
                price=29.99,
                quantity=5,
                reorder_level=15,
                supplier_id=supplier1.id
            )
        ]
        
        for product in products:
            db.session.add(product)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
