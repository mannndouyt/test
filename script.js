document.addEventListener('DOMContentLoaded', function() {
    // بيانات الطلبات المبدئية
    let orders = [
        {
            id: 1234,
            customer: "أحمد محمد",
            phone: "0551234567",
            state: "الرياض",
            amount: 450,
            date: "2024-01-15",
            status: "new",
            products: "ساعة ذكية، سماعات بلوتوث"
        },
        {
            id: 1235,
            customer: "سارة خالد",
            phone: "0549876543",
            state: "جدة",
            amount: 320,
            date: "2024-01-15",
            status: "confirmed",
            products: "حقيبة يد، محفظة"
        },
        {
            id: 1236,
            customer: "محمد علي",
            phone: "0561122334",
            state: "الدمام",
            amount: 890,
            date: "2024-01-14",
            status: "shipped",
            products: "هاتف ذكي، غطاء واقي"
        },
        {
            id: 1237,
            customer: "فاطمة سعيد",
            phone: "0504455667",
            state: "الرياض",
            amount: 150,
            date: "2024-01-14",
            status: "cancelled",
            products: "كتب، أقلام"
        },
        {
            id: 1238,
            customer: "خالد عبدالله",
            phone: "0598889999",
            state: "مكة",
            amount: 540,
            date: "2024-01-13",
            status: "confirmed",
            products: "أحذية رياضية، جوارب"
        },
        {
            id: 1239,
            customer: "نورة أحمد",
            phone: "0577771234",
            state: "جدة",
            amount: 275,
            date: "2024-01-13",
            status: "new",
            products: "عطر، كريم"
        },
        {
            id: 1240,
            customer: "عبدالعزيز سالم",
            phone: "0512345678",
            state: "الرياض",
            amount: 1200,
            date: "2024-01-12",
            status: "shipped",
            products: "لابتوب، حقيبة حمل"
        },
        {
            id: 1241,
            customer: "لينا فهد",
            phone: "0539876541",
            state: "الدمام",
            amount: 380,
            date: "2024-01-12",
            status: "confirmed",
            products: "نظارة شمس، علبة نظارة"
        },
        {
            id: 1242,
            customer: "ياسر ناصر",
            phone: "",
            state: "الرياض",
            amount: 670,
            date: "2024-01-11",
            status: "new",
            products: "كاميرا، حامل كاميرا"
        },
        {
            id: 1243,
            customer: "هند عبدالرحمن",
            phone: "0581122334",
            state: "جدة",
            amount: 95,
            date: "2024-01-10",
            status: "new",
            products: "إكسسوارات شعر"
        }
    ];

    // عناصر DOM
    const ordersList = document.getElementById('ordersList');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterStatus = document.getElementById('filterStatus');
    const filterState = document.getElementById('filterState');
    const addOrderBtn = document.getElementById('addOrderBtn');
    const orderModal = document.getElementById('orderModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const orderForm = document.getElementById('orderForm');
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const closeAlert = document.querySelector('.close-alert');
    const autoFixBtn = document.getElementById('autoFixBtn');
    
    // عناصر الإحصائيات
    const totalOrdersEl = document.getElementById('totalOrders');
    const newOrdersEl = document.getElementById('newOrders');
    const confirmedOrdersEl = document.getElementById('confirmedOrders');
    const shippedOrdersEl = document.getElementById('shippedOrders');
    const cancelledOrdersEl = document.getElementById('cancelledOrders');
    const errorOrdersEl = document.getElementById('errorOrders');

    // تحديث الإحصائيات
    function updateStats() {
        const total = orders.length;
        const newOrders = orders.filter(o => o.status === 'new').length;
        const confirmed = orders.filter(o => o.status === 'confirmed').length;
        const shipped = orders.filter(o => o.status === 'shipped').length;
        const cancelled = orders.filter(o => o.status === 'cancelled').length;
        const errors = orders.filter(o => !o.phone || o.phone === '').length;
        
        totalOrdersEl.textContent = total;
        newOrdersEl.textContent = newOrders;
        confirmedOrdersEl.textContent = confirmed;
        shippedOrdersEl.textContent = shipped;
        cancelledOrdersEl.textContent = cancelled;
        errorOrdersEl.textContent = errors;
        
        // تحديث عدد الأخطاء في القائمة الجانبية
        const errorBadge = document.querySelector('.badge');
        if (errorBadge) {
            errorBadge.textContent = errors;
        }
    }

    // عرض الطلبات
    function renderOrders(filteredOrders = orders) {
        ordersList.innerHTML = '';
        
        filteredOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            // تحديد اسم الحالة
            let statusText, statusClass;
            switch(order.status) {
                case 'new':
                    statusText = '🟡 جديد';
                    statusClass = 'status-new';
                    break;
                case 'confirmed':
                    statusText = '🟢 مؤكد';
                    statusClass = 'status-confirmed';
                    break;
                case 'shipped':
                    statusText = '🔵 مشحون';
                    statusClass = 'status-shipped';
                    break;
                case 'cancelled':
                    statusText = '🔴 ملغى';
                    statusClass = 'status-cancelled';
                    break;
            }
            
            // التحقق من وجود خطأ في الهاتف
            const hasError = !order.phone || order.phone === '';
            const errorIndicator = hasError ? '<i class="fas fa-exclamation-circle" style="color: #ff9e00; margin-right: 5px;"></i>' : '';
            
            orderItem.innerHTML = `
                <div>${errorIndicator} ${order.id}</div>
                <div>${order.customer}</div>
                <div>${order.phone || '<span style="color: #ff9e00;">ناقص</span>'}</div>
                <div>${order.state}</div>
                <div>${order.amount} ر.س</div>
                <div>${order.date}</div>
                <div><span class="status-badge ${statusClass}">${statusText}</span></div>
                <div class="order-actions">
                    <button class="action-btn edit-order" data-id="${order.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn change-status" data-id="${order.id}" title="تغيير الحالة">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                    <button class="action-btn delete-order" data-id="${order.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            ordersList.appendChild(orderItem);
        });
        
        // إضافة معالجات الأحداث للأزرار
        document.querySelectorAll('.edit-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = parseInt(this.getAttribute('data-id'));
                editOrder(orderId);
            });
        });
        
        document.querySelectorAll('.change-status').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = parseInt(this.getAttribute('data-id'));
                changeStatus(orderId);
            });
        });
        
        document.querySelectorAll('.delete-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = parseInt(this.getAttribute('data-id'));
                deleteOrder(orderId);
            });
        });
    }

    // البحث والتصفية
    function filterOrders() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilter = filterStatus.value;
        const stateFilter = filterState.value;
        
        let filtered = orders.filter(order => {
            // البحث
            const matchesSearch = searchTerm === '' || 
                order.customer.toLowerCase().includes(searchTerm) ||
                order.phone.includes(searchTerm) ||
                order.id.toString().includes(searchTerm);
            
            // التصفية حسب الحالة
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            
            // التصفية حسب الولاية
            const matchesState = stateFilter === 'all' || order.state === stateFilter;
            
            return matchesSearch && matchesStatus && matchesState;
        });
        
        renderOrders(filtered);
    }

    // إظهار رسالة تنبيه
    function showAlert(message, type = 'info') {
        alertMessage.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.classList.add('show');
        
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 5000);
    }

    // إضافة طلب جديد
    function addOrder(orderData) {
        // توليد معرف جديد
        const newId = Math.max(...orders.map(o => o.id)) + 1;
        
        const newOrder = {
            id: newId,
            customer: orderData.customerName,
            phone: orderData.customerPhone,
            state: orderData.orderState,
            amount: parseInt(orderData.orderAmount),
            date: new Date().toISOString().split('T')[0],
            status: orderData.orderStatus,
            products: orderData.orderProducts || 'لم يتم تحديد المنتجات'
        };
        
        orders.unshift(newOrder);
        renderOrders();
        updateStats();
        showAlert(`تم إضافة الطلب #${newId} بنجاح`, 'success');
        closeOrderModal();
    }

    // تعديل طلب موجود
    function editOrder(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = `تعديل الطلب #${orderId}`;
        
        document.getElementById('customerName').value = order.customer;
        document.getElementById('customerPhone').value = order.phone;
        document.getElementById('orderState').value = order.state;
        document.getElementById('customerAddress').value = 'عنوان تفصيلي للعميل...';
        document.getElementById('orderAmount').value = order.amount;
        document.getElementById('orderStatus').value = order.status;
        document.getElementById('orderProducts').value = order.products;
        
        // تغيير زر الحفظ لتحديث الطلب
        const submitBtn = orderForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'تحديث الطلب';
        submitBtn.onclick = function(e) {
            e.preventDefault();
            updateOrder(orderId);
        };
        
        orderModal.style.display = 'flex';
    }

    // تحديث طلب
    function updateOrder(orderId) {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;
        
        orders[orderIndex].customer = document.getElementById('customerName').value;
        orders[orderIndex].phone = document.getElementById('customerPhone').value;
        orders[orderIndex].state = document.getElementById('orderState').value;
        orders[orderIndex].amount = parseInt(document.getElementById('orderAmount').value);
        orders[orderIndex].status = document.getElementById('orderStatus').value;
        orders[orderIndex].products = document.getElementById('orderProducts').value;
        
        renderOrders();
        updateStats();
        showAlert(`تم تحديث الطلب #${orderId} بنجاح`, 'success');
        closeOrderModal();
    }

    // تغيير حالة الطلب
    function changeStatus(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        // تحديد الحالة التالية
        const statusOrder = ['new', 'confirmed', 'shipped', 'cancelled'];
        const currentIndex = statusOrder.indexOf(order.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        const nextStatus = statusOrder[nextIndex];
        
        order.status = nextStatus;
        
        // محاكاة التحديث في Google Sheets
        simulateGoogleSheetsUpdate(orderId, nextStatus);
        
        renderOrders();
        updateStats();
        
        let statusText = '';
        switch(nextStatus) {
            case 'new': statusText = '🟡 جديد'; break;
            case 'confirmed': statusText = '🟢 مؤكد'; break;
            case 'shipped': statusText = '🔵 مشحون'; break;
            case 'cancelled': statusText = '🔴 ملغى'; break;
        }
        
        showAlert(`تم تغيير حالة الطلب #${orderId} إلى ${statusText}`, 'success');
    }

    // حذف طلب
    function deleteOrder(orderId) {
        if (confirm(`هل أنت متأكد من حذف الطلب #${orderId}؟`)) {
            orders = orders.filter(o => o.id !== orderId);
            renderOrders();
            updateStats();
            showAlert(`تم حذف الطلب #${orderId} بنجاح`, 'success');
        }
    }

    // محاكاة تحديث Google Sheets
    function simulateGoogleSheetsUpdate(orderId, status) {
        console.log(`[Google Sheets] تحديث الطلب #${orderId} إلى حالة: ${status}`);
        // في التطبيق الحقيقي، هنا سيتم استدعاء Google Sheets API
    }

    // فتح نموذج إضافة طلب جديد
    function openOrderModal() {
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'إضافة طلب جديد';
        
        // إعادة تعيين النموذج
        orderForm.reset();
        
        // تعيين القيم الافتراضية
        document.getElementById('orderStatus').value = 'new';
        
        // تغيير زر الحفظ لإضافة طلب
        const submitBtn = orderForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'حفظ الطلب';
        submitBtn.onclick = function(e) {
            e.preventDefault();
            const formData = {
                customerName: document.getElementById('customerName').value,
                customerPhone: document.getElementById('customerPhone').value,
                orderState: document.getElementById('orderState').value,
                orderAmount: document.getElementById('orderAmount').value,
                orderStatus: document.getElementById('orderStatus').value,
                orderProducts: document.getElementById('orderProducts').value
            };
            addOrder(formData);
        };
        
        orderModal.style.display = 'flex';
    }

    // إغلاق النموذج المنبثق
    function closeOrderModal() {
        orderModal.style.display = 'none';
    }

    // التصحيح التلقائي للأخطاء
    function autoFixErrors() {
        let fixedCount = 0;
        
        orders.forEach(order => {
            if (!order.phone || order.phone === '') {
                // توليد رقم هاتف عشوائي (محاكاة)
                const randomPhone = '05' + Math.floor(10000000 + Math.random() * 90000000);
                order.phone = randomPhone;
                fixedCount++;
            }
        });
        
        if (fixedCount > 0) {
            renderOrders();
            updateStats();
            showAlert(`تم تصحيح ${fixedCount} أخطاء تلقائياً`, 'success');
        } else {
            showAlert('لا توجد أخطاء تحتاج إلى تصحيح', 'info');
        }
    }

    // معالجة تصدير البيانات
    function setupExportButtons() {
        document.querySelectorAll('.btn-export').forEach(btn => {
            btn.addEventListener('click', function() {
                const exportType = this.parentElement.querySelector('h4').textContent;
                showAlert(`جارٍ تحضير ملف ${exportType} للتحميل...`, 'info');
                
                // في التطبيق الحقيقي، هنا سيتم إنشاء الملف وتنزيله
                setTimeout(() => {
                    showAlert(`تم تحميل ملف ${exportType} بنجاح`, 'success');
                }, 1500);
            });
        });
    }

    // إعداد معالجات الأحداث
    function setupEventListeners() {
        // البحث
        searchBtn.addEventListener('click', filterOrders);
        searchInput.addEventListener('keyup', filterOrders);
        
        // التصفية
        filterStatus.addEventListener('change', filterOrders);
        filterState.addEventListener('change', filterOrders);
        
        // إضافة طلب جديد
        addOrderBtn.addEventListener('click', openOrderModal);
        
        // إغلاق النموذج المنبثق
        closeModal.addEventListener('click', closeOrderModal);
        cancelBtn.addEventListener('click', closeOrderModal);
        
        // إغلاق النموذج بالضغط خارج المحتوى
        window.addEventListener('click', function(event) {
            if (event.target === orderModal) {
                closeOrderModal();
            }
        });
        
        // إغلاق رسالة التنبيه
        closeAlert.addEventListener('click', function() {
            alertBox.classList.remove('show');
        });
        
        // التصحيح التلقائي
        autoFixBtn.addEventListener('click', autoFixErrors);
        
        // تصدير البيانات
        setupExportButtons();
        
        // تصحيح الأخطاء يدوياً
        document.querySelectorAll('.error-actions .btn-small').forEach(btn => {
            if (btn.textContent.includes('تصحيح يدوي')) {
                btn.addEventListener('click', function() {
                    const orderId = this.getAttribute('data-order');
                    showAlert(`فتح نموذج تصحيح الطلب #${orderId}`, 'info');
                });
            }
        });
    }

    // تهيئة التطبيق
    function init() {
        renderOrders();
        updateStats();
        setupEventListeners();
        
        // محاكاة تحديث البيانات كل 30 ثانية
        setInterval(() => {
            // في التطبيق الحقيقي، هنا سيتم مزامنة البيانات مع Google Sheets
            const lastSync = document.querySelector('.last-sync');
            if (lastSync) {
                lastSync.textContent = 'آخر مزامنة: الآن';
                
                // إرجاع النص بعد 2 دقيقة
                setTimeout(() => {
                    lastSync.textContent = 'آخر مزامنة: قبل دقيقتين';
                }, 120000);
            }
        }, 30000);
    }

    // بدء تشغيل التطبيق
    init();
});
