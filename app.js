/**
 * Invoize - Invoice PDF Generator
 * Main Application Script
 */

// ==========================================================================
// APPLICATION STATE
// ==========================================================================
let state = {
    businessDetails: {
        name: 'REJU CABLE TV NETWORK',
        address: 'AGRAHARAM NALLEPILLY PO PLAKAKKAD,PIN:678553',
        phone: '',
        email: '',
        gstin: ''
    },
    customerDetails: {
        name: '',
        address: '',
        phone: '',
        gstin: ''
    },
    invoiceDetails: {
        date: ''
    },
    items: [],
    discountType: 'percentage',
    discountValue: 0,
    gstType: 'cgst_sgst',
    gstRate: 0,
    notes: '',
    showBusinessContact: true,
    showCustomer: true,
    showDate: true,
    showDiscount: true,
    showGst: true,
    showNotes: true,
    showSignature: true
};



// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const DOM = {
    // Buttons & Theme
    btnSample: document.getElementById('btn-sample'),
    btnClear: document.getElementById('btn-clear'),
    themeToggle: document.getElementById('theme-toggle'),
    btnPrint: document.getElementById('btn-print'),
    btnGeneratePdf: document.getElementById('btn-generate-pdf'),

    // Tabs
    tabEdit: document.getElementById('tab-edit'),
    tabPreview: document.getElementById('tab-preview'),
    editorPane: document.getElementById('editor-pane'),
    previewPane: document.getElementById('preview-pane'),



    // Business Inputs
    businessPhone: document.getElementById('business-phone'),
    businessEmail: document.getElementById('business-email'),
    businessGstin: document.getElementById('business-gstin'),

    // Customer Inputs
    customerName: document.getElementById('customer-name'),
    customerAddress: document.getElementById('customer-address'),
    customerPhone: document.getElementById('customer-phone'),
    customerGstin: document.getElementById('customer-gstin'),

    // Invoice details
    invoiceDate: document.getElementById('invoice-date'),

    // Items
    itemsTableBody: document.getElementById('items-table-body'),
    btnAddItem: document.getElementById('btn-add-item'),

    // Taxes & Discounts Inputs
    discountType: document.getElementById('invoice-discount-type'),
    discountValue: document.getElementById('invoice-discount-value'),
    gstType: document.getElementById('invoice-gst-type'),
    gstRate: document.getElementById('invoice-gst-rate'),
    invoiceNotes: document.getElementById('invoice-notes'),

    previewBusinessName: document.getElementById('preview-business-name'),
    previewBusinessAddress: document.getElementById('preview-business-address'),
    previewBusinessPhone: document.getElementById('preview-business-phone'),
    previewBusinessPhoneRow: document.getElementById('preview-business-phone-row'),
    previewBusinessEmailRow: document.getElementById('preview-business-email-row'),
    previewBusinessEmail: document.getElementById('preview-business-email'),
    previewBusinessGstinRow: document.getElementById('preview-business-gstin-row'),
    previewBusinessGstin: document.getElementById('preview-business-gstin'),

    previewCustomerName: document.getElementById('preview-customer-name'),
    previewCustomerAddress: document.getElementById('preview-customer-address'),
    previewCustomerPhone: document.getElementById('preview-customer-phone'),
    previewCustomerPhoneRow: document.getElementById('preview-customer-phone-row'),
    previewCustomerGstinRow: document.getElementById('preview-customer-gstin-row'),
    previewCustomerGstin: document.getElementById('preview-customer-gstin'),

    previewInvoiceDate: document.getElementById('preview-invoice-date'),

    previewItemsBody: document.getElementById('preview-items-body'),
    previewDiscountRow: document.getElementById('preview-discount-row'),
    previewDiscountLabel: document.getElementById('preview-discount-label'),
    previewDiscount: document.getElementById('preview-discount'),
    previewTaxableRow: document.getElementById('preview-taxable-row'),
    previewTaxable: document.getElementById('preview-taxable'),
    previewCgstRow: document.getElementById('preview-cgst-row'),
    previewCgstLabel: document.getElementById('preview-cgst-label'),
    previewCgst: document.getElementById('preview-cgst'),
    previewSgstRow: document.getElementById('preview-sgst-row'),
    previewSgstLabel: document.getElementById('preview-sgst-label'),
    previewSgst: document.getElementById('preview-sgst'),
    previewIgstRow: document.getElementById('preview-igst-row'),
    previewIgstLabel: document.getElementById('preview-igst-label'),
    previewIgst: document.getElementById('preview-igst'),
    previewSingleGstRow: document.getElementById('preview-single-gst-row'),
    previewSingleGstLabel: document.getElementById('preview-single-gst-label'),
    previewSingleGst: document.getElementById('preview-single-gst'),
    previewGrandTotal: document.getElementById('preview-grand-total'),
    previewAmountWords: document.getElementById('preview-amount-words'),
    previewNotes: document.getElementById('preview-notes'),

    // Section Toggle Controls
    toggleBusiness: document.getElementById('toggle-section-business'),
    toggleCustomer: document.getElementById('toggle-section-customer'),
    toggleDate: document.getElementById('toggle-section-date'),
    toggleDiscount: document.getElementById('toggle-section-discount'),
    toggleGst: document.getElementById('toggle-section-gst'),
    toggleNotes: document.getElementById('toggle-section-notes'),
    toggleSignature: document.getElementById('toggle-section-signature'),

    // Card Containers
    cardBusiness: document.getElementById('card-business'),
    cardCustomer: document.getElementById('card-customer'),
    cardDate: document.getElementById('card-date'),
    cardDiscount: document.getElementById('card-discount'),
    cardGst: document.getElementById('card-gst'),
    cardNotes: document.getElementById('card-notes'),
    cardSignature: document.getElementById('card-signature'),

    // Preview Blocks
    previewBusinessContact: document.getElementById('preview-business-contact-block'),
    previewCustomer: document.getElementById('preview-customer-section'),
    previewDate: document.getElementById('preview-date-section'),
    previewNotesSection: document.getElementById('preview-notes-section'),
    previewSignatureSection: document.getElementById('preview-signature-section'),

    // Scroll controls
    scrollControls: document.getElementById('preview-scroll-controls'),
    btnScrollUp: document.getElementById('btn-scroll-up'),
    btnScrollDown: document.getElementById('btn-scroll-down'),

    // Authentication Elements
    loginScreen: document.getElementById('login-screen'),
    appContainer: document.getElementById('app-container'),
    loginForm: document.getElementById('login-form'),
    loginPassword: document.getElementById('login-password'),
    btnTogglePassword: document.getElementById('btn-toggle-password'),
    loginError: document.getElementById('login-error'),
    btnLogout: document.getElementById('btn-logout'),
    loginCanvas: document.getElementById('login-canvas')
};

// ==========================================================================
// CORE FUNCTIONS / CALCULATIONS & RENDERERS
// ==========================================================================

/**
 * Format currency value helper (Indian Rupee layout default)
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Generate a random sequential-like invoice number
 */
function generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${rand}`;
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

/**
 * Format YYYY-MM-DD date string to display format DD-MM-YYYY
 */
function formatDateToDisplay(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        // parts = [YYYY, MM, DD]
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
}

/**
 * Convert number to words in Indian System (Lakhs, Crores, etc.)
 */
function convertNumberToWords(num) {
    if (num === 0) return 'Rupees Zero Only';

    // Split into rupees and paise parts
    const parts = num.toFixed(2).split('.');
    const rupees = parseInt(parts[0], 10);
    const paise = parseInt(parts[1], 10);

    let result = '';

    if (rupees > 0) {
        result += convertRupees(rupees) + ' Rupees';
    }

    if (paise > 0) {
        if (rupees > 0) result += ' and ';
        result += convertRupees(paise) + ' Paise';
    }

    return result ? result + ' Only' : 'Rupees Zero Only';
}

function convertRupees(amount) {
    const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const double = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (amount < 20) return single[amount];

    if (amount < 100) {
        return double[Math.floor(amount / 10)] + (amount % 10 !== 0 ? " " + single[amount % 10] : "");
    }

    if (amount < 1000) {
        return single[Math.floor(amount / 100)] + " Hundred" + (amount % 100 !== 0 ? " and " + convertRupees(amount % 100) : "");
    }

    if (amount < 100000) { // 1 Lakh
        return convertRupees(Math.floor(amount / 1000)) + " Thousand" + (amount % 1000 !== 0 ? " " + convertRupees(amount % 1000) : "");
    }

    if (amount < 10000000) { // 1 Crore
        return convertRupees(Math.floor(amount / 100000)) + " Lakh" + (amount % 100000 !== 0 ? " " + convertRupees(amount % 100000) : "");
    }

    return convertRupees(Math.floor(amount / 10000000)) + " Crore" + (amount % 10000000 !== 0 ? " " + convertRupees(amount % 10000000) : "");
}

/**
 * Sync form DOM elements with State object
 */
function syncInputsToState() {
    state.businessDetails.phone = DOM.businessPhone.value;
    state.businessDetails.email = DOM.businessEmail.value;
    state.businessDetails.gstin = DOM.businessGstin.value;

    state.customerDetails.name = DOM.customerName.value;
    state.customerDetails.address = DOM.customerAddress.value;
    state.customerDetails.phone = DOM.customerPhone.value;
    state.customerDetails.gstin = DOM.customerGstin.value;

    state.invoiceDetails.date = DOM.invoiceDate.value;

    state.discountType = DOM.discountType.value;
    state.discountValue = parseFloat(DOM.discountValue.value) || 0;
    state.gstType = DOM.gstType.value;
    state.gstRate = parseFloat(DOM.gstRate.value) || 0;
    state.notes = DOM.invoiceNotes.value;
}

/**
 * Sync State values back into Form inputs
 */
function syncStateToInputs() {
    DOM.businessPhone.value = state.businessDetails.phone;
    DOM.businessEmail.value = state.businessDetails.email;
    DOM.businessGstin.value = state.businessDetails.gstin;

    DOM.customerName.value = state.customerDetails.name;
    DOM.customerAddress.value = state.customerDetails.address;
    DOM.customerPhone.value = state.customerDetails.phone;
    DOM.customerGstin.value = state.customerDetails.gstin;

    DOM.invoiceDate.value = state.invoiceDetails.date;

    DOM.discountType.value = state.discountType;
    DOM.discountValue.value = state.discountValue;
    DOM.gstType.value = state.gstType;
    DOM.gstRate.value = state.gstRate;
    DOM.invoiceNotes.value = state.notes;

    updateSectionTogglesUI();
}

/**
 * Perform all financial math calculations and update previews
 */
function calculateInvoice() {
    let subtotal = 0;

    // 1. Calculate each item line amount
    state.items.forEach(item => {
        const itemAmount = (item.quantity * item.price) || 0;
        item.amount = itemAmount;
        subtotal += itemAmount;

        // Update input field in the editor row (if rendered)
        const totalSpan = document.getElementById(`item-total-${item.id}`);
        if (totalSpan) {
            totalSpan.textContent = formatCurrency(itemAmount);
        }
    });

    // 2. Calculate discount
    let discountAmount = 0;
    if (state.discountType === 'percentage') {
        discountAmount = subtotal * (state.discountValue / 100);
    } else {
        discountAmount = state.discountValue;
    }
    // Cap discount to prevent negative totals
    if (discountAmount > subtotal) {
        discountAmount = subtotal;
    }

    // 3. Final calculations
    const activeDiscount = state.showDiscount ? discountAmount : 0;
    const taxableAmount = Math.max(0, subtotal - activeDiscount);

    let gstAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let singleGstAmount = 0;

    const activeGstRate = state.showGst ? state.gstRate : 0;

    if (activeGstRate > 0) {
        gstAmount = taxableAmount * (activeGstRate / 100);
        if (state.gstType === 'cgst_sgst') {
            cgstAmount = gstAmount / 2;
            sgstAmount = gstAmount / 2;
        } else if (state.gstType === 'igst') {
            igstAmount = gstAmount;
        } else {
            singleGstAmount = gstAmount;
        }
    }

    const grandTotal = taxableAmount + gstAmount;

    // 4. Update preview variables
    DOM.previewGrandTotal.textContent = formatCurrency(grandTotal);
    DOM.previewAmountWords.textContent = convertNumberToWords(grandTotal);

    if (state.showDiscount && discountAmount > 0) {
        DOM.previewDiscountRow.classList.remove('hidden');
        DOM.previewDiscount.textContent = `-${formatCurrency(discountAmount)}`;
        DOM.previewDiscountLabel.textContent = state.discountType === 'percentage' ? `(${state.discountValue}%)` : '';
    } else {
        DOM.previewDiscountRow.classList.add('hidden');
    }

    // Show taxable value row if discount is active AND GST rate is active > 0
    if (state.showGst && activeGstRate > 0 && discountAmount > 0) {
        DOM.previewTaxableRow.classList.remove('hidden');
        DOM.previewTaxable.textContent = formatCurrency(taxableAmount);
    } else {
        DOM.previewTaxableRow.classList.add('hidden');
    }

    // Show GST rows based on type
    if (state.showGst && activeGstRate > 0) {
        if (state.gstType === 'cgst_sgst') {
            DOM.previewCgstRow.classList.remove('hidden');
            DOM.previewCgstLabel.textContent = `(${activeGstRate / 2}%)`;
            DOM.previewCgst.textContent = formatCurrency(cgstAmount);

            DOM.previewSgstRow.classList.remove('hidden');
            DOM.previewSgstLabel.textContent = `(${activeGstRate / 2}%)`;
            DOM.previewSgst.textContent = formatCurrency(sgstAmount);

            DOM.previewIgstRow.classList.add('hidden');
            DOM.previewSingleGstRow.classList.add('hidden');
        } else if (state.gstType === 'igst') {
            DOM.previewCgstRow.classList.add('hidden');
            DOM.previewSgstRow.classList.add('hidden');

            DOM.previewIgstRow.classList.remove('hidden');
            DOM.previewIgstLabel.textContent = `(${activeGstRate}%)`;
            DOM.previewIgst.textContent = formatCurrency(igstAmount);

            DOM.previewSingleGstRow.classList.add('hidden');
        } else {
            DOM.previewCgstRow.classList.add('hidden');
            DOM.previewSgstRow.classList.add('hidden');
            DOM.previewIgstRow.classList.add('hidden');

            DOM.previewSingleGstRow.classList.remove('hidden');
            DOM.previewSingleGstLabel.textContent = `(${activeGstRate}%)`;
            DOM.previewSingleGst.textContent = formatCurrency(singleGstAmount);
        }
    } else {
        DOM.previewCgstRow.classList.add('hidden');
        DOM.previewSgstRow.classList.add('hidden');
        DOM.previewIgstRow.classList.add('hidden');
        DOM.previewSingleGstRow.classList.add('hidden');
    }
}

/**
 * Render dynamic item rows in the Editor Panel Form
 */
function renderEditorItems() {
    DOM.itemsTableBody.innerHTML = '';

    if (state.items.length === 0) {
        DOM.itemsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center" style="padding: 2rem; color: var(--text-muted); text-align: center;">
                    <i class="fa-solid fa-folder-open" style="font-size: 1.5rem; display: block; margin-bottom: 8px;"></i>
                    No items added yet. Click "Add Item" to begin.
                </td>
            </tr>
        `;
        return;
    }

    state.items.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <textarea class="item-desc" rows="1" placeholder="Item description" required>${item.description}</textarea>
            </td>
            <td>
                <input type="number" class="item-qty" min="0" step="any" value="${item.quantity}" required>
            </td>
            <td>
                <input type="number" class="item-price" min="0" step="0.01" value="${item.price}" required>
            </td>
            <td class="width-total text-right">
                <span id="item-total-${item.id}">${formatCurrency(item.quantity * item.price)}</span>
            </td>
            <td class="width-action">
                <button type="button" class="btn btn-icon btn-danger btn-sm delete-item-btn" data-id="${item.id}" title="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;

        // Wire events for editor row fields
        const descInput = tr.querySelector('.item-desc');
        const qtyInput = tr.querySelector('.item-qty');
        const priceInput = tr.querySelector('.item-price');
        const deleteBtn = tr.querySelector('.delete-item-btn');

        // Auto-grow textarea height to fit content
        const adjustHeight = (el) => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        };

        // Initialize height once attached to the document
        setTimeout(() => adjustHeight(descInput), 0);

        descInput.addEventListener('input', (e) => {
            item.description = e.target.value;
            adjustHeight(e.target);
            syncStateToPreview();
        });

        qtyInput.addEventListener('input', (e) => {
            item.quantity = parseFloat(e.target.value) || 0;
            calculateInvoice();
            syncStateToPreview();
        });

        priceInput.addEventListener('input', (e) => {
            item.price = parseFloat(e.target.value) || 0;
            calculateInvoice();
            syncStateToPreview();
        });

        deleteBtn.addEventListener('click', () => {
            deleteItem(item.id);
        });

        DOM.itemsTableBody.appendChild(tr);
    });
}

/**
 * Render items table inside the A4 Preview Document
 */
function renderPreviewItems() {
    DOM.previewItemsBody.innerHTML = '';

    if (state.items.length === 0) {
        DOM.previewItemsBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center" style="padding: 1.5rem 0; color: #94a3b8; text-align: center;">
                    No invoice items.
                </td>
            </tr>
        `;
        return;
    }

    state.items.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="col-index">${index + 1}</td>
            <td class="col-desc">
                <strong style="color: #0f172a; display: block; font-size: 0.85rem;">${item.description || 'New Service Item'}</strong>
            </td>
            <td class="col-qty text-right">${item.quantity}</td>
            <td class="col-total text-right">${formatCurrency(item.quantity * item.price)}</td>
        `;
        DOM.previewItemsBody.appendChild(tr);
    });
}

/**
 * Write state values directly onto the A4 Preview Document
 */
function syncStateToPreview() {

    // Business Details
    DOM.previewBusinessName.textContent = state.businessDetails.name;
    DOM.previewBusinessAddress.textContent = state.businessDetails.address;

    if (state.businessDetails.phone) {
        DOM.previewBusinessPhoneRow.classList.remove('hidden');
        DOM.previewBusinessPhone.textContent = state.businessDetails.phone;
    } else {
        DOM.previewBusinessPhoneRow.classList.add('hidden');
    }

    if (state.businessDetails.email) {
        DOM.previewBusinessEmailRow.classList.remove('hidden');
        DOM.previewBusinessEmail.textContent = state.businessDetails.email;
    } else {
        DOM.previewBusinessEmailRow.classList.add('hidden');
    }

    if (state.businessDetails.gstin) {
        DOM.previewBusinessGstinRow.classList.remove('hidden');
        DOM.previewBusinessGstin.textContent = state.businessDetails.gstin;
    } else {
        DOM.previewBusinessGstinRow.classList.add('hidden');
    }

    // Customer Details
    DOM.previewCustomerName.textContent = state.customerDetails.name;
    DOM.previewCustomerAddress.textContent = state.customerDetails.address;

    if (state.customerDetails.phone) {
        DOM.previewCustomerPhoneRow.classList.remove('hidden');
        DOM.previewCustomerPhone.textContent = state.customerDetails.phone;
    } else {
        DOM.previewCustomerPhoneRow.classList.add('hidden');
    }

    if (state.customerDetails.gstin) {
        DOM.previewCustomerGstinRow.classList.remove('hidden');
        DOM.previewCustomerGstin.textContent = state.customerDetails.gstin;
    } else {
        DOM.previewCustomerGstinRow.classList.add('hidden');
    }

    // Invoice Meta Details
    DOM.previewInvoiceDate.textContent = formatDateToDisplay(state.invoiceDetails.date) || formatDateToDisplay(formatDate(new Date()));

    // Toggle Business Contacts preview
    if (state.showBusinessContact) {
        DOM.previewBusinessContact.classList.remove('hidden');
    } else {
        DOM.previewBusinessContact.classList.add('hidden');
    }

    // Toggle Customer Details preview
    if (state.showCustomer) {
        DOM.previewCustomer.classList.remove('hidden');
    } else {
        DOM.previewCustomer.classList.add('hidden');
    }

    // Toggle Date Section preview
    if (state.showDate) {
        DOM.previewDate.classList.remove('hidden');
    } else {
        DOM.previewDate.classList.add('hidden');
    }

    // Toggle Notes Section
    if (state.showNotes && state.notes) {
        DOM.previewNotesSection.classList.remove('hidden');
        DOM.previewNotes.textContent = state.notes;
    } else {
        DOM.previewNotesSection.classList.add('hidden');
    }

    // Toggle Signature Section
    if (state.showSignature) {
        DOM.previewSignatureSection.classList.remove('hidden');
    } else {
        DOM.previewSignatureSection.classList.add('hidden');
    }

    // Render Preview Table
    renderPreviewItems();

    // Zoom Calculations
    updatePreviewZoom();
}

/**
 * Global trigger to sync form modifications into app updates
 */
function handleFormChange() {
    syncInputsToState();
    calculateInvoice();
    syncStateToPreview();
}

// ==========================================================================
// DYNAMIC TABLE LINE OPERATIONS
// ==========================================================================

function addItem(description = '', quantity = 1, price = 0) {
    const newItem = {
        id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 100),
        description: description,
        quantity: quantity,
        price: price,
        amount: quantity * price
    };
    state.items.push(newItem);
    renderEditorItems();
    calculateInvoice();
    syncStateToPreview();
}

function deleteItem(id) {
    state.items = state.items.filter(item => item.id !== id);
    renderEditorItems();
    calculateInvoice();
    syncStateToPreview();
}

// ==========================================================================
// SCREEN SCALING / A4 PAGE ZOOM HANDLER
// ==========================================================================

function updatePreviewZoom() {
    const container = document.querySelector('.preview-page-container');
    const doc = document.getElementById('invoice-document');
    const wrapper = document.querySelector('.preview-zoom-wrapper');
    if (!container || !doc || !wrapper) return;

    // Get actual padding dynamically to compute true width
    const paddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft) || 0;
    const paddingRight = parseFloat(window.getComputedStyle(container).paddingRight) || 0;
    const containerWidth = container.clientWidth - (paddingLeft + paddingRight);

    const docWidth = 794; // Target A4 width at 96 DPI

    let zoom = 1;
    if (containerWidth < docWidth) {
        zoom = containerWidth / docWidth;
    }

    // Calculate translate X to center the document horizontally
    const translateX = (containerWidth - (docWidth * zoom)) / 2;

    // Apply transform (translate to center + scale)
    wrapper.style.transform = `translate(${translateX}px, 0) scale(${zoom})`;

    // Adjust height of the container to match scaled document
    container.style.height = `${doc.offsetHeight * zoom + (paddingLeft + paddingRight)}px`;

    // Check scroll buttons visibility
    setTimeout(updateScrollButtonsVisibility, 100);
}

// ==========================================================================
// ACTIONS HANDLERS (PDF / PRINT / THEME / FORMS)
// ==========================================================================

/**
 * Generate PDF download via html2pdf
 */
function downloadPDF() {
    const element = document.getElementById('invoice-document');

    // Add scanning/generating class for subtle spinner or UX cue if needed
    DOM.btnGeneratePdf.disabled = true;
    DOM.btnGeneratePdf.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating...`;

    const filename = `Invoice_${state.businessDetails.name.replace(/\s+/g, '_')}_${state.invoiceDetails.date}.pdf`;

    const options = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2.5, // High definition DPI
            useCORS: true,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
        .set(options)
        .from(element)
        .toPdf()
        .get('pdf')
        .then(function (pdf) {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setTextColor(100, 116, 139); // Slate 500 (#64748b)
                pdf.setFont('helvetica', 'normal');

                const pageText = `Page ${i} of ${totalPages}`;
                pdf.text(pageText, pdf.internal.pageSize.getWidth() - 1.2, pdf.internal.pageSize.getHeight() - 0.5);
            }
        })
        .save()
        .then(() => {
            // Restore button
            DOM.btnGeneratePdf.disabled = false;
            DOM.btnGeneratePdf.innerHTML = `<i class="fa-solid fa-download"></i> Download PDF`;
        })
        .catch(err => {
            console.error('PDF Generation Error:', err);
            DOM.btnGeneratePdf.disabled = false;
            DOM.btnGeneratePdf.innerHTML = `<i class="fa-solid fa-download"></i> Download PDF`;
            alert('Failed to generate PDF. Please try again or use the Print option.');
        });
}

/**
 * Trigger Native Browser Printing
 */
function printInvoice() {
    window.print();
}

/**
 * Initialize / Reset form values to initial clear states
 */
function clearForm() {
    state = {
        businessDetails: {
            name: 'REJU CABLE TV NETWORK',
            address: 'AGRAHARAM NALLEPILLY PO PLAKAKKAD,PIN:678553',
            phone: '',
            email: '',
            gstin: ''
        },
        customerDetails: {
            name: '',
            address: '',
            phone: '',
            gstin: ''
        },
        invoiceDetails: {
            date: formatDate(new Date())
        },
        items: [],
        discountType: 'percentage',
        discountValue: 0,
        gstType: 'cgst_sgst',
        gstRate: 0,
        notes: '',
        showBusinessContact: true,
        showCustomer: true,
        showDate: true,
        showDiscount: true,
        showGst: true,
        showNotes: true,
        showSignature: true
    };

    // Sync UI components
    syncStateToInputs();
    renderEditorItems();
    calculateInvoice();
    syncStateToPreview();
}

/**
 * Populate mock data for instant verification and templates
 */
function loadSampleData() {
    state.businessDetails = {
        name: 'REJU CABLE TV NETWORK',
        address: 'AGRAHARAM NALLEPILLY PO PLAKAKKAD,PIN:678553',
        phone: '+91 4923 222333',
        email: 'reju.cabletv@gmail.com',
        gstin: '32AAAAA1111A1Z1'
    };

    state.customerDetails = {
        name: 'Globex Consulting Corporation LLC',
        address: 'Building 12B, IT SEZ Area, Sector 62,\nNoida, Uttar Pradesh 201301',
        phone: '+91 98100 23456',
        gstin: '09AAACG5678D2ZC'
    };

    state.invoiceDetails = {
        date: formatDate(new Date())
    };

    state.items = [
        {
            id: 'sample-1',
            description: 'Cloud Infrastructure Consulting & Architecture Design Service',
            quantity: 15,
            price: 4500,
            amount: 67500
        },
        {
            id: 'sample-2',
            description: 'Enterprise React Dashboard Development - Monthly Retainer Phase 2',
            quantity: 1,
            price: 125000,
            amount: 125000
        },
        {
            id: 'sample-3',
            description: 'Amazon Web Services (AWS) Hosting & Database Migration Support Services',
            quantity: 8,
            price: 3200,
            amount: 25600
        }
    ];

    state.discountType = 'percentage';
    state.discountValue = 5; // 5% discount
    state.gstType = 'cgst_sgst';
    state.gstRate = 18;
    state.notes = 'Payment Terms: Please pay via bank transfer to Apex Tech Solutions.\nHDFC Bank, Branch: BKC Mumbai, A/C: 50200012345678, IFSC: HDFC0000123.\nInterest at 12% p.a. charged after the due date.';
    state.showBusinessContact = true;
    state.showCustomer = true;
    state.showDate = true;
    state.showDiscount = true;
    state.showGst = true;
    state.showNotes = true;
    state.showSignature = true;

    // Sync elements
    syncStateToInputs();
    renderEditorItems();
    calculateInvoice();
    syncStateToPreview();
}

/**
 * Handle Theme Light/Dark Mode Switcher
 */
function setupThemeToggle() {
    const htmlElement = document.documentElement;

    DOM.themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);

        // Change icon
        const icon = DOM.themeToggle.querySelector('i');
        if (newTheme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    });
}

/**
 * Setup mobile editor / preview tabs display
 */
function setupMobileTabs() {
    DOM.tabEdit.addEventListener('click', () => {
        DOM.tabEdit.classList.add('active');
        DOM.tabPreview.classList.remove('active');
        DOM.editorPane.classList.add('active-panel');
        DOM.previewPane.classList.remove('active-panel');
    });

    DOM.tabPreview.addEventListener('click', () => {
        DOM.tabPreview.classList.add('active');
        DOM.tabEdit.classList.remove('active');
        DOM.previewPane.classList.add('active-panel');
        DOM.editorPane.classList.remove('active-panel');

        // Redraw zoom on reveal (since widths were zero while hidden)
        setTimeout(updatePreviewZoom, 50);
    });
}



/**
 * Wire generic change events to standard inputs for real-time reactivity
 */
function wireInputListeners() {
    const inputElements = [
        DOM.businessPhone, DOM.businessEmail, DOM.businessGstin,
        DOM.customerName, DOM.customerAddress, DOM.customerPhone, DOM.customerGstin,
        DOM.invoiceDate,
        DOM.discountType, DOM.discountValue, DOM.gstType, DOM.gstRate, DOM.invoiceNotes
    ];

    inputElements.forEach(element => {
        element.addEventListener('input', handleFormChange);
    });
}

/**
 * Manage eye button clicks and state variables
 */
function setupSectionToggles() {
    const toggleConfigs = [
        { key: 'showBusinessContact', btn: DOM.toggleBusiness },
        { key: 'showCustomer', btn: DOM.toggleCustomer },
        { key: 'showDate', btn: DOM.toggleDate },
        { key: 'showDiscount', btn: DOM.toggleDiscount },
        { key: 'showGst', btn: DOM.toggleGst },
        { key: 'showNotes', btn: DOM.toggleNotes },
        { key: 'showSignature', btn: DOM.toggleSignature }
    ];

    toggleConfigs.forEach(cfg => {
        if (!cfg.btn) return;
        cfg.btn.addEventListener('click', () => {
            state[cfg.key] = !state[cfg.key];
            updateSectionTogglesUI();
            calculateInvoice();
            syncStateToPreview();
        });
    });
}

/**
 * Update UI classes for toggles and form bodies
 */
function updateSectionTogglesUI() {
    const toggleConfigs = [
        { key: 'showBusinessContact', btn: DOM.toggleBusiness, card: DOM.cardBusiness },
        { key: 'showCustomer', btn: DOM.toggleCustomer, card: DOM.cardCustomer },
        { key: 'showDate', btn: DOM.toggleDate, card: DOM.cardDate },
        { key: 'showDiscount', btn: DOM.toggleDiscount, card: DOM.cardDiscount },
        { key: 'showGst', btn: DOM.toggleGst, card: DOM.cardGst },
        { key: 'showNotes', btn: DOM.toggleNotes, card: DOM.cardNotes },
        { key: 'showSignature', btn: DOM.toggleSignature, card: DOM.cardSignature }
    ];

    toggleConfigs.forEach(cfg => {
        if (!cfg.btn) return;
        const isVisible = state[cfg.key];

        if (isVisible) {
            cfg.btn.classList.remove('section-hidden');
            cfg.btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            if (cfg.card) cfg.card.classList.remove('section-disabled');
        } else {
            cfg.btn.classList.add('section-hidden');
            cfg.btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            if (cfg.card) cfg.card.classList.add('section-disabled');
        }
    });
}

/**
 * Dynamic visibility checker for preview scroll buttons
 */
function updateScrollButtonsVisibility() {
    const previewPane = document.querySelector('.preview-pane');
    if (!previewPane || !DOM.scrollControls) return;

    // Show buttons if scrollable content exceeds visible viewport
    if (previewPane.scrollHeight > previewPane.clientHeight + 50) {
        DOM.scrollControls.classList.remove('hidden');
    } else {
        DOM.scrollControls.classList.add('hidden');
    }
}

/**
 * Configure preview pane scrolling handlers
 */
function setupScrollControls() {
    const previewPane = document.querySelector('.preview-pane');
    if (!previewPane || !DOM.btnScrollUp || !DOM.btnScrollDown) return;

    DOM.btnScrollUp.addEventListener('click', () => {
        previewPane.scrollTo({ top: 0, behavior: 'smooth' });
    });

    DOM.btnScrollDown.addEventListener('click', () => {
        previewPane.scrollTo({ top: previewPane.scrollHeight, behavior: 'smooth' });
    });

    previewPane.addEventListener('scroll', updateScrollButtonsVisibility);
}

/**
 * Setup password gate authentication control
 */
function setupAuthentication() {
    const SECRET_PASSWORD = 'rahul123'; // Default password - feel free to edit this string!

    // Check existing login status
    if (localStorage.getItem('invoize_authenticated') === 'true') {
        if (DOM.loginScreen) DOM.loginScreen.classList.add('hidden');
        if (DOM.appContainer) DOM.appContainer.classList.remove('hidden');
    } else {
        if (DOM.loginScreen) DOM.loginScreen.classList.remove('hidden');
        if (DOM.appContainer) DOM.appContainer.classList.add('hidden');
    }

    // Toggle password eye visibility
    if (DOM.btnTogglePassword && DOM.loginPassword) {
        DOM.btnTogglePassword.addEventListener('click', () => {
            const isPassword = DOM.loginPassword.type === 'password';
            DOM.loginPassword.type = isPassword ? 'text' : 'password';
            const icon = DOM.btnTogglePassword.querySelector('i');
            if (icon) {
                icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
            }
        });
    }

    // Form submit listener
    if (DOM.loginForm) {
        DOM.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (DOM.loginPassword.value === SECRET_PASSWORD) {
                localStorage.setItem('invoize_authenticated', 'true');
                if (DOM.loginScreen) DOM.loginScreen.classList.add('hidden');
                if (DOM.appContainer) DOM.appContainer.classList.remove('hidden');

                // Redraw zoom factor to fit content
                setTimeout(updatePreviewZoom, 100);
            } else {
                if (DOM.loginError) {
                    DOM.loginError.classList.remove('hidden');
                    // Trigger reflow to restart CSS shake animation
                    DOM.loginError.style.animation = 'none';
                    DOM.loginError.offsetHeight; /* trigger reflow */
                    DOM.loginError.style.animation = '';
                }

                DOM.loginPassword.value = '';
                DOM.loginPassword.focus();
            }
        });
    }

    // Logout / Lock application handler
    if (DOM.btnLogout) {
        DOM.btnLogout.addEventListener('click', () => {
            localStorage.removeItem('invoize_authenticated');
            location.reload(); // Lock immediately by reloading
        });
    }
}

/**
 * Interactive HTML5 canvas particle background motion graphics
 */
function initLoginCanvas() {
    const canvas = DOM.loginCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 45;
    const connectionDistance = 110;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1
        });
    }

    function draw() {
        if (DOM.loginScreen && DOM.loginScreen.classList.contains('hidden')) {
            // Stop updating canvas once the app is unlocked to conserve CPU/battery
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        // Accent adaptive colors
        const particleColor = theme === 'dark' ? 'rgba(14, 165, 233, 0.25)' : 'rgba(2, 132, 199, 0.15)';
        const lineColor = theme === 'dark' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(2, 132, 199, 0.05)';

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Loop boundaries
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        });

        // Draw connection lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = (1 - dist / connectionDistance) * 0.7;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

function init() {
    // 0. Setup authentication gate
    setupAuthentication();
    initLoginCanvas();

    // 1. Assign today's date
    state.invoiceDetails.date = formatDate(new Date());

    // 2. Start with an empty items list

    // 3. Setup core interactions
    setupThemeToggle();
    setupMobileTabs();
    setupSectionToggles();
    setupScrollControls();
    wireInputListeners();

    // 4. Action button handlers
    DOM.btnAddItem.addEventListener('click', () => addItem('', 1, 0));
    DOM.btnSample.addEventListener('click', loadSampleData);
    DOM.btnClear.addEventListener('click', clearForm);
    DOM.btnGeneratePdf.addEventListener('click', downloadPDF);
    DOM.btnPrint.addEventListener('click', printInvoice);

    // 5. Sync details
    syncStateToInputs();
    renderEditorItems();
    calculateInvoice();
    syncStateToPreview();

    // 6. Window resize zooming
    window.addEventListener('resize', updatePreviewZoom);

    // Redraw zoom factor after a small delay to allow DOM calculations to finish
    setTimeout(updatePreviewZoom, 300);
}

document.addEventListener('DOMContentLoaded', init);
