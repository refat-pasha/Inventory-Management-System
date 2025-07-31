// Inventory Management System JavaScript
class InventoryManager {
    constructor() {
        this.products = [
            {
                id: 1,
                sku: "PROD-001",
                name: "Laptop Computer",
                description: "High-performance business laptop",
                category: "Electronics",
                price: 999.99,
                quantity: 25,
                reorder_level: 10,
                supplier: "Tech Supplies Inc"
            },
            {
                id: 2,
                sku: "PROD-002", 
                name: "Office Chair",
                description: "Ergonomic office chair with lumbar support",
                category: "Furniture",
                price: 299.99,
                quantity: 15,
                reorder_level: 5,
                supplier: "Office Furnishings Co"
            },
            {
                id: 3,
                sku: "PROD-003",
                name: "Wireless Mouse",
                description: "Bluetooth wireless optical mouse",
                category: "Electronics",
                price: 29.99,
                quantity: 5,
                reorder_level: 15,
                supplier: "Tech Supplies Inc"
            }
        ];

        this.suppliers = [
            {
                id: 1,
                name: "Tech Supplies Inc",
                contact_person: "John Smith",
                email: "john@techsupplies.com",
                phone: "+1-555-0123",
                address: "123 Tech Street, Silicon Valley, CA"
            },
            {
                id: 2,
                name: "Office Furnishings Co",
                contact_person: "Sarah Johnson",
                email: "sarah@officefurnishings.com", 
                phone: "+1-555-0456",
                address: "456 Business Ave, New York, NY"
            }
        ];

        this.transactions = [
            {
                id: 1,
                product_name: "Laptop Computer",
                transaction_type: "Stock In",
                quantity: 10,
                price: 999.99,
                total: 9999.90,
                date: "2025-07-07",
                notes: "Received new shipment"
            },
            {
                id: 2,
                product_name: "Office Chair", 
                transaction_type: "Stock Out",
                quantity: 2,
                price: 299.99,
                total: 599.98,
                date: "2025-07-06",
                notes: "Sale to customer"
            }
        ];

        this.currentModule = 'dashboard';
        this.editingProduct = null;
        this.editingSupplier = null;
        this.charts = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateDropdowns();
        this.showModule('dashboard');
        this.updateDashboard();
        this.populateProductTable();
        this.populateSupplierTable();
        this.populateTransactionTable();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = e.target.dataset.module;
                this.showModule(module);
            });
        });

        // Product Management
        document.getElementById('add-product-btn').addEventListener('click', () => {
            this.showProductModal();
        });

        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        document.getElementById('product-modal-close').addEventListener('click', () => {
            this.hideProductModal();
        });

        document.getElementById('product-cancel').addEventListener('click', () => {
            this.hideProductModal();
        });

        // Supplier Management
        document.getElementById('add-supplier-btn').addEventListener('click', () => {
            this.showSupplierModal();
        });

        document.getElementById('supplier-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSupplier();
        });

        document.getElementById('supplier-modal-close').addEventListener('click', () => {
            this.hideSupplierModal();
        });

        document.getElementById('supplier-cancel').addEventListener('click', () => {
            this.hideSupplierModal();
        });

        // Transaction Management
        document.getElementById('add-transaction-btn').addEventListener('click', () => {
            this.showTransactionModal();
        });

        document.getElementById('transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });

        document.getElementById('transaction-modal-close').addEventListener('click', () => {
            this.hideTransactionModal();
        });

        document.getElementById('transaction-cancel').addEventListener('click', () => {
            this.hideTransactionModal();
        });

        // Auto-populate price when product is selected in transaction form
        document.getElementById('transaction-product').addEventListener('change', (e) => {
            const productName = e.target.value;
            const product = this.products.find(p => p.name === productName);
            if (product) {
                document.getElementById('transaction-price').value = product.price;
            }
        });

        // Search and Filters
        document.getElementById('product-search').addEventListener('input', () => {
            this.filterProducts();
        });

        document.getElementById('category-filter').addEventListener('change', () => {
            this.filterProducts();
        });

        document.getElementById('transaction-type-filter').addEventListener('change', () => {
            this.filterTransactions();
        });

        document.getElementById('date-filter').addEventListener('change', () => {
            this.filterTransactions();
        });

        // Reports
        document.getElementById('report-type').addEventListener('change', () => {
            this.generateReport();
        });

        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }

    showModule(moduleName) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected module
        document.getElementById(moduleName).classList.add('active');
        document.querySelector(`[data-module="${moduleName}"]`).classList.add('active');

        this.currentModule = moduleName;

        // Update content based on module
        switch(moduleName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'products':
                this.populateProductTable();
                this.populateCategories();
                break;
            case 'suppliers':
                this.populateSupplierTable();
                break;
            case 'transactions':
                this.populateTransactionTable();
                break;
            case 'reports':
                this.generateReport();
                break;
        }
    }

    updateDashboard() {
        // Update statistics
        const totalProducts = this.products.length;
        const totalValue = this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const lowStockItems = this.products.filter(product => product.quantity <= product.reorder_level).length;
        const outOfStockItems = this.products.filter(product => product.quantity === 0).length;

        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('low-stock').textContent = lowStockItems;
        document.getElementById('total-suppliers').textContent = this.suppliers.length;

        // Update charts
        this.updateCharts();

        // Update recent transactions
        this.updateRecentTransactions();
    }

    updateCharts() {
        // Destroy existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });

        // Inventory Distribution Chart
        const categoryData = this.getCategoryData();
        const inventoryCtx = document.getElementById('inventoryChart').getContext('2d');
        this.charts.inventory = new Chart(inventoryCtx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Stock Levels Chart
        const stockData = this.getStockData();
        const stockCtx = document.getElementById('stockChart').getContext('2d');
        this.charts.stock = new Chart(stockCtx, {
            type: 'bar',
            data: {
                labels: stockData.labels,
                datasets: [{
                    label: 'Stock Quantity',
                    data: stockData.values,
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    getCategoryData() {
        const categories = {};
        this.products.forEach(product => {
            categories[product.category] = (categories[product.category] || 0) + product.quantity;
        });
        return {
            labels: Object.keys(categories),
            values: Object.values(categories)
        };
    }

    getStockData() {
        const sortedProducts = [...this.products]
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
        return {
            labels: sortedProducts.map(p => p.name),
            values: sortedProducts.map(p => p.quantity)
        };
    }

    updateRecentTransactions() {
        const container = document.getElementById('recent-transactions');
        const recentTransactions = this.transactions.slice(-5).reverse();
        
        container.innerHTML = '';
        
        if (recentTransactions.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No recent transactions</p></div>';
            return;
        }

        recentTransactions.forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-item-info">
                    <div class="activity-item-title">${transaction.product_name}</div>
                    <div class="activity-item-details">
                        ${transaction.transaction_type} - ${transaction.quantity} units - $${transaction.total.toFixed(2)}
                    </div>
                </div>
                <div class="activity-item-date">${transaction.date}</div>
            `;
            container.appendChild(item);
        });
    }

    // Product Management
    populateProductTable() {
        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = '';

        this.products.forEach(product => {
            const row = document.createElement('tr');
            const status = this.getStockStatus(product);
            
            row.innerHTML = `
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td><span class="stock-status ${status.class}">${status.text}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" data-action="edit-product" data-id="${product.id}" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" data-action="delete-product" data-id="${product.id}" title="Delete">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners for action buttons
        document.querySelectorAll('[data-action="edit-product"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.editProduct(id);
            });
        });

        document.querySelectorAll('[data-action="delete-product"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteProduct(id);
            });
        });
    }

    getStockStatus(product) {
        if (product.quantity === 0) {
            return { class: 'out-of-stock', text: 'Out of Stock' };
        } else if (product.quantity <= product.reorder_level) {
            return { class: 'low-stock', text: 'Low Stock' };
        } else {
            return { class: 'in-stock', text: 'In Stock' };
        }
    }

    populateCategories() {
        const categories = [...new Set(this.products.map(p => p.category))];
        const select = document.getElementById('category-filter');
        select.innerHTML = '<option value="">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }

    showProductModal(product = null) {
        this.editingProduct = product;
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        
        // Ensure dropdowns are populated
        this.populateDropdowns();
        
        if (product) {
            title.textContent = 'Edit Product';
            // Small delay to ensure dropdown is populated
            setTimeout(() => {
                this.fillProductForm(product);
            }, 100);
        } else {
            title.textContent = 'Add Product';
            this.clearProductForm();
        }
        
        modal.classList.add('show');
    }

    fillProductForm(product) {
        document.getElementById('product-sku').value = product.sku;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-reorder').value = product.reorder_level;
        document.getElementById('product-supplier').value = product.supplier;
    }

    clearProductForm() {
        document.getElementById('product-form').reset();
        document.getElementById('product-sku').value = this.generateSKU();
    }

    generateSKU() {
        const prefix = 'PROD-';
        const nextNum = (this.products.length + 1).toString().padStart(3, '0');
        return prefix + nextNum;
    }

    saveProduct() {
        const formData = {
            sku: document.getElementById('product-sku').value,
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            category: document.getElementById('product-category').value,
            price: parseFloat(document.getElementById('product-price').value),
            quantity: parseInt(document.getElementById('product-quantity').value),
            reorder_level: parseInt(document.getElementById('product-reorder').value),
            supplier: document.getElementById('product-supplier').value
        };

        if (this.editingProduct) {
            // Update existing product
            const index = this.products.findIndex(p => p.id === this.editingProduct.id);
            this.products[index] = { ...this.editingProduct, ...formData };
        } else {
            // Add new product
            const newProduct = {
                id: Math.max(...this.products.map(p => p.id)) + 1,
                ...formData
            };
            this.products.push(newProduct);
        }

        this.hideProductModal();
        this.populateProductTable();
        this.populateCategories();
        this.populateDropdowns();
        this.updateDashboard();
        this.showMessage('Product saved successfully!', 'success');
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.showProductModal(product);
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.populateProductTable();
            this.populateCategories();
            this.populateDropdowns();
            this.updateDashboard();
            this.showMessage('Product deleted successfully!', 'success');
        }
    }

    hideProductModal() {
        document.getElementById('product-modal').classList.remove('show');
        this.editingProduct = null;
    }

    filterProducts() {
        const searchTerm = document.getElementById('product-search').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;
        
        const filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.sku.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            
            return matchesSearch && matchesCategory;
        });

        this.renderFilteredProducts(filteredProducts);
    }

    renderFilteredProducts(products) {
        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            const status = this.getStockStatus(product);
            
            row.innerHTML = `
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td><span class="stock-status ${status.class}">${status.text}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" data-action="edit-product" data-id="${product.id}" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" data-action="delete-product" data-id="${product.id}" title="Delete">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Re-add event listeners for action buttons
        document.querySelectorAll('[data-action="edit-product"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.editProduct(id);
            });
        });

        document.querySelectorAll('[data-action="delete-product"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteProduct(id);
            });
        });
    }

    // Supplier Management
    populateSupplierTable() {
        const tbody = document.getElementById('suppliers-table-body');
        tbody.innerHTML = '';

        this.suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.contact_person}</td>
                <td>${supplier.email}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.address}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" data-action="edit-supplier" data-id="${supplier.id}" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" data-action="delete-supplier" data-id="${supplier.id}" title="Delete">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners for action buttons
        document.querySelectorAll('[data-action="edit-supplier"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.editSupplier(id);
            });
        });

        document.querySelectorAll('[data-action="delete-supplier"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.deleteSupplier(id);
            });
        });
    }

    showSupplierModal(supplier = null) {
        this.editingSupplier = supplier;
        const modal = document.getElementById('supplier-modal');
        const title = document.getElementById('supplier-modal-title');
        
        if (supplier) {
            title.textContent = 'Edit Supplier';
            this.fillSupplierForm(supplier);
        } else {
            title.textContent = 'Add Supplier';
            this.clearSupplierForm();
        }
        
        modal.classList.add('show');
    }

    fillSupplierForm(supplier) {
        document.getElementById('supplier-name').value = supplier.name;
        document.getElementById('supplier-contact').value = supplier.contact_person;
        document.getElementById('supplier-email').value = supplier.email;
        document.getElementById('supplier-phone').value = supplier.phone;
        document.getElementById('supplier-address').value = supplier.address;
    }

    clearSupplierForm() {
        document.getElementById('supplier-form').reset();
    }

    saveSupplier() {
        const formData = {
            name: document.getElementById('supplier-name').value,
            contact_person: document.getElementById('supplier-contact').value,
            email: document.getElementById('supplier-email').value,
            phone: document.getElementById('supplier-phone').value,
            address: document.getElementById('supplier-address').value
        };

        if (this.editingSupplier) {
            // Update existing supplier
            const index = this.suppliers.findIndex(s => s.id === this.editingSupplier.id);
            this.suppliers[index] = { ...this.editingSupplier, ...formData };
        } else {
            // Add new supplier
            const newSupplier = {
                id: Math.max(...this.suppliers.map(s => s.id)) + 1,
                ...formData
            };
            this.suppliers.push(newSupplier);
        }

        this.hideSupplierModal();
        this.populateSupplierTable();
        this.populateDropdowns();
        this.updateDashboard();
        this.showMessage('Supplier saved successfully!', 'success');
    }

    editSupplier(id) {
        const supplier = this.suppliers.find(s => s.id === id);
        if (supplier) {
            this.showSupplierModal(supplier);
        }
    }

    deleteSupplier(id) {
        if (confirm('Are you sure you want to delete this supplier?')) {
            this.suppliers = this.suppliers.filter(s => s.id !== id);
            this.populateSupplierTable();
            this.populateDropdowns();
            this.updateDashboard();
            this.showMessage('Supplier deleted successfully!', 'success');
        }
    }

    hideSupplierModal() {
        document.getElementById('supplier-modal').classList.remove('show');
        this.editingSupplier = null;
    }

    // Transaction Management
    populateTransactionTable() {
        const tbody = document.getElementById('transactions-table-body');
        tbody.innerHTML = '';

        this.transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.product_name}</td>
                <td><span class="status ${transaction.transaction_type === 'Stock In' ? 'status--success' : 'status--warning'}">${transaction.transaction_type}</span></td>
                <td>${transaction.quantity}</td>
                <td>$${transaction.price.toFixed(2)}</td>
                <td>$${transaction.total.toFixed(2)}</td>
                <td>${transaction.notes}</td>
            `;
            tbody.appendChild(row);
        });
    }

    showTransactionModal() {
        const modal = document.getElementById('transaction-modal');
        this.clearTransactionForm();
        // Ensure dropdowns are populated
        this.populateDropdowns();
        modal.classList.add('show');
    }

    clearTransactionForm() {
        document.getElementById('transaction-form').reset();
    }

    saveTransaction() {
        const productName = document.getElementById('transaction-product').value;
        const transactionType = document.getElementById('transaction-type').value;
        const quantity = parseInt(document.getElementById('transaction-quantity').value);
        const price = parseFloat(document.getElementById('transaction-price').value);
        const notes = document.getElementById('transaction-notes').value;

        if (!productName || !transactionType || !quantity || !price) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }

        const transaction = {
            id: Math.max(...this.transactions.map(t => t.id)) + 1,
            product_name: productName,
            transaction_type: transactionType,
            quantity: quantity,
            price: price,
            total: quantity * price,
            date: new Date().toISOString().split('T')[0],
            notes: notes
        };

        this.transactions.push(transaction);

        // Update product quantity
        const product = this.products.find(p => p.name === productName);
        if (product) {
            if (transactionType === 'Stock In') {
                product.quantity += quantity;
            } else if (transactionType === 'Stock Out') {
                product.quantity = Math.max(0, product.quantity - quantity);
            }
        }

        this.hideTransactionModal();
        this.populateTransactionTable();
        this.updateDashboard();
        this.showMessage('Transaction saved successfully!', 'success');
    }

    hideTransactionModal() {
        document.getElementById('transaction-modal').classList.remove('show');
    }

    filterTransactions() {
        const typeFilter = document.getElementById('transaction-type-filter').value;
        const dateFilter = document.getElementById('date-filter').value;
        
        const filteredTransactions = this.transactions.filter(transaction => {
            const matchesType = !typeFilter || transaction.transaction_type === typeFilter;
            const matchesDate = !dateFilter || transaction.date === dateFilter;
            
            return matchesType && matchesDate;
        });

        this.renderFilteredTransactions(filteredTransactions);
    }

    renderFilteredTransactions(transactions) {
        const tbody = document.getElementById('transactions-table-body');
        tbody.innerHTML = '';

        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.product_name}</td>
                <td><span class="status ${transaction.transaction_type === 'Stock In' ? 'status--success' : 'status--warning'}">${transaction.transaction_type}</span></td>
                <td>${transaction.quantity}</td>
                <td>$${transaction.price.toFixed(2)}</td>
                <td>$${transaction.total.toFixed(2)}</td>
                <td>${transaction.notes}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Dropdown Population
    populateDropdowns() {
        // Supplier dropdown in product form
        const supplierSelect = document.getElementById('product-supplier');
        const currentSupplier = supplierSelect.value;
        supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
        
        this.suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.name;
            option.textContent = supplier.name;
            if (supplier.name === currentSupplier) {
                option.selected = true;
            }
            supplierSelect.appendChild(option);
        });

        // Product dropdown in transaction form
        const productSelect = document.getElementById('transaction-product');
        const currentProduct = productSelect.value;
        productSelect.innerHTML = '<option value="">Select Product</option>';
        
        this.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name;
            option.textContent = product.name;
            if (product.name === currentProduct) {
                option.selected = true;
            }
            productSelect.appendChild(option);
        });
    }

    // Reports
    generateReport() {
        const reportType = document.getElementById('report-type').value;
        const reportContent = document.getElementById('report-content');
        
        switch(reportType) {
            case 'inventory':
                this.generateInventoryReport(reportContent);
                break;
            case 'low-stock':
                this.generateLowStockReport(reportContent);
                break;
            case 'supplier':
                this.generateSupplierReport(reportContent);
                break;
            case 'transaction':
                this.generateTransactionReport(reportContent);
                break;
        }
    }

    generateInventoryReport(container) {
        const totalValue = this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const totalQuantity = this.products.reduce((sum, product) => sum + product.quantity, 0);
        
        container.innerHTML = `
            <h3>Inventory Report</h3>
            <div class="report-summary">
                <div class="report-metric">
                    <h4>${this.products.length}</h4>
                    <p>Total Products</p>
                </div>
                <div class="report-metric">
                    <h4>${totalQuantity}</h4>
                    <p>Total Quantity</p>
                </div>
                <div class="report-metric">
                    <h4>$${totalValue.toFixed(2)}</h4>
                    <p>Total Value</p>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.products.map(product => `
                            <tr>
                                <td>${product.sku}</td>
                                <td>${product.name}</td>
                                <td>${product.category}</td>
                                <td>${product.quantity}</td>
                                <td>$${product.price.toFixed(2)}</td>
                                <td>$${(product.price * product.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateLowStockReport(container) {
        const lowStockProducts = this.products.filter(product => product.quantity <= product.reorder_level);
        
        container.innerHTML = `
            <h3>Low Stock Report</h3>
            <div class="report-summary">
                <div class="report-metric">
                    <h4>${lowStockProducts.length}</h4>
                    <p>Items Need Reorder</p>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Product Name</th>
                            <th>Current Stock</th>
                            <th>Reorder Level</th>
                            <th>Supplier</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lowStockProducts.map(product => {
                            const status = this.getStockStatus(product);
                            return `
                                <tr>
                                    <td>${product.sku}</td>
                                    <td>${product.name}</td>
                                    <td>${product.quantity}</td>
                                    <td>${product.reorder_level}</td>
                                    <td>${product.supplier}</td>
                                    <td><span class="stock-status ${status.class}">${status.text}</span></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateSupplierReport(container) {
        const supplierStats = this.suppliers.map(supplier => {
            const supplierProducts = this.products.filter(p => p.supplier === supplier.name);
            const totalValue = supplierProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            
            return {
                ...supplier,
                productCount: supplierProducts.length,
                totalValue: totalValue
            };
        });

        container.innerHTML = `
            <h3>Supplier Report</h3>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Supplier Name</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Products</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${supplierStats.map(supplier => `
                            <tr>
                                <td>${supplier.name}</td>
                                <td>${supplier.contact_person}</td>
                                <td>${supplier.email}</td>
                                <td>${supplier.phone}</td>
                                <td>${supplier.productCount}</td>
                                <td>$${supplier.totalValue.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateTransactionReport(container) {
        const stockInTotal = this.transactions
            .filter(t => t.transaction_type === 'Stock In')
            .reduce((sum, t) => sum + t.total, 0);
        
        const stockOutTotal = this.transactions
            .filter(t => t.transaction_type === 'Stock Out')
            .reduce((sum, t) => sum + t.total, 0);

        container.innerHTML = `
            <h3>Transaction Report</h3>
            <div class="report-summary">
                <div class="report-metric">
                    <h4>${this.transactions.length}</h4>
                    <p>Total Transactions</p>
                </div>
                <div class="report-metric">
                    <h4>$${stockInTotal.toFixed(2)}</h4>
                    <p>Stock In Value</p>
                </div>
                <div class="report-metric">
                    <h4>$${stockOutTotal.toFixed(2)}</h4>
                    <p>Stock Out Value</p>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.transactions.map(transaction => `
                            <tr>
                                <td>${transaction.date}</td>
                                <td>${transaction.product_name}</td>
                                <td><span class="status ${transaction.transaction_type === 'Stock In' ? 'status--success' : 'status--warning'}">${transaction.transaction_type}</span></td>
                                <td>${transaction.quantity}</td>
                                <td>$${transaction.price.toFixed(2)}</td>
                                <td>$${transaction.total.toFixed(2)}</td>
                                <td>${transaction.notes}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Utility Methods
    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.right = '20px';
        messageDiv.style.zIndex = '10000';
        messageDiv.style.padding = '12px 16px';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.maxWidth = '300px';
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the application
const inventoryManager = new InventoryManager();