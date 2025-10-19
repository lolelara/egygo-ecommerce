/**
 * Invoice Generator
 * Generates PDF invoices for orders, commissions, and payments
 */

import jsPDF from 'jspdf';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  type: 'order' | 'commission' | 'payment';
  
  // Customer/User info
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  
  // Merchant/Affiliate info
  merchantName?: string;
  affiliateName?: string;
  
  // Items
  items: {
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  
  // Totals
  subtotal: number;
  commission?: number;
  platformFee?: number;
  total: number;
  
  // Payment info
  paymentMethod?: string;
  paymentStatus?: string;
}

export class InvoiceGenerator {
  private doc: jsPDF;
  
  constructor() {
    this.doc = new jsPDF();
  }
  
  generate(data: InvoiceData): jsPDF {
    this.doc = new jsPDF();
    
    // Header
    this.addHeader(data);
    
    // Company Info
    this.addCompanyInfo();
    
    // Customer Info
    this.addCustomerInfo(data);
    
    // Items Table
    this.addItemsTable(data);
    
    // Totals
    this.addTotals(data);
    
    // Footer
    this.addFooter();
    
    return this.doc;
  }
  
  private addHeader(data: InvoiceData) {
    // Logo placeholder
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EgyGo', 20, 20);
    
    // Invoice title
    this.doc.setFontSize(18);
    const title = data.type === 'order' ? 'Invoice' : 
                  data.type === 'commission' ? 'Commission Statement' : 
                  'Payment Receipt';
    this.doc.text(title, 150, 20);
    
    // Invoice number and date
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Invoice #: ${data.invoiceNumber}`, 150, 28);
    this.doc.text(`Date: ${data.date}`, 150, 34);
  }
  
  private addCompanyInfo() {
    this.doc.setFontSize(10);
    this.doc.text('EgyGo - Your Egyptian Market', 20, 35);
    this.doc.text('Cairo, Egypt', 20, 41);
    this.doc.text('Phone: 01034324551', 20, 47);
    this.doc.text('Email: support@egygo.com', 20, 53);
  }
  
  private addCustomerInfo(data: InvoiceData) {
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Bill To:', 20, 65);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.text(data.customerName, 20, 72);
    
    if (data.customerPhone) {
      this.doc.text(data.customerPhone, 20, 78);
    }
    
    if (data.customerAddress) {
      this.doc.text(data.customerAddress, 20, 84);
    }
    
    if (data.merchantName) {
      this.doc.text(`Merchant: ${data.merchantName}`, 20, 90);
    }
    
    if (data.affiliateName) {
      this.doc.text(`Affiliate: ${data.affiliateName}`, 20, 96);
    }
  }
  
  private addItemsTable(data: InvoiceData) {
    const startY = 110;
    
    // Table header
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(20, startY, 170, 8, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Description', 25, startY + 6);
    this.doc.text('Qty', 120, startY + 6);
    this.doc.text('Price', 140, startY + 6);
    this.doc.text('Total', 170, startY + 6);
    
    // Table rows
    this.doc.setFont('helvetica', 'normal');
    let y = startY + 15;
    
    data.items.forEach((item, index) => {
      if (y > 250) {
        this.doc.addPage();
        y = 20;
      }
      
      this.doc.text(item.description, 25, y);
      this.doc.text(item.quantity.toString(), 120, y);
      this.doc.text(`${item.price.toFixed(2)} EGP`, 140, y);
      this.doc.text(`${item.total.toFixed(2)} EGP`, 170, y);
      
      y += 8;
    });
    
    return y;
  }
  
  private addTotals(data: InvoiceData) {
    const startY = 200;
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Subtotal:', 140, startY);
    this.doc.text(`${data.subtotal.toFixed(2)} EGP`, 170, startY);
    
    let y = startY + 8;
    
    if (data.commission) {
      this.doc.text('Commission:', 140, y);
      this.doc.text(`${data.commission.toFixed(2)} EGP`, 170, y);
      y += 8;
    }
    
    if (data.platformFee) {
      this.doc.text('Platform Fee:', 140, y);
      this.doc.text(`${data.platformFee.toFixed(2)} EGP`, 170, y);
      y += 8;
    }
    
    // Total line
    this.doc.setLineWidth(0.5);
    this.doc.line(140, y, 190, y);
    y += 8;
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.text('Total:', 140, y);
    this.doc.text(`${data.total.toFixed(2)} EGP`, 170, y);
    
    if (data.paymentMethod) {
      y += 10;
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.doc.text(`Payment Method: ${data.paymentMethod}`, 140, y);
    }
    
    if (data.paymentStatus) {
      y += 6;
      this.doc.text(`Status: ${data.paymentStatus}`, 140, y);
    }
  }
  
  private addFooter() {
    const pageHeight = this.doc.internal.pageSize.height;
    
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'italic');
    this.doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' });
    this.doc.text('For support: support@egygo.com | 01034324551', 105, pageHeight - 15, { align: 'center' });
    this.doc.text('Vodafone Cash: 01034324551 | InstaPay: ebank_hema@instapay', 105, pageHeight - 10, { align: 'center' });
  }
  
  save(filename: string) {
    this.doc.save(filename);
  }
  
  getBlob(): Blob {
    return this.doc.output('blob');
  }
  
  getDataUrl(): string {
    return this.doc.output('dataurlstring');
  }
}

// Helper functions
export const generateOrderInvoice = (order: any): jsPDF => {
  const generator = new InvoiceGenerator();
  
  const invoiceData: InvoiceData = {
    invoiceNumber: order.orderId || order.$id,
    date: new Date(order.createdAt).toLocaleDateString('en-GB'),
    type: 'order',
    customerName: order.customerName || 'Customer',
    customerPhone: order.phone,
    customerAddress: order.address,
    merchantName: order.merchantName,
    items: order.items?.map((item: any) => ({
      description: item.productName || item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    })) || [],
    subtotal: order.subtotal || order.totalAmount,
    total: order.totalAmount,
    paymentMethod: order.paymentMethod || 'Cash on Delivery',
    paymentStatus: order.paymentStatus || 'Pending',
  };
  
  return generator.generate(invoiceData);
};

export const generateCommissionInvoice = (commission: any): jsPDF => {
  const generator = new InvoiceGenerator();
  
  const invoiceData: InvoiceData = {
    invoiceNumber: `COM-${commission.$id}`,
    date: new Date(commission.createdAt).toLocaleDateString('en-GB'),
    type: 'commission',
    customerName: commission.affiliateName || 'Affiliate',
    affiliateName: commission.affiliateName,
    items: [{
      description: `Commission for Order #${commission.orderId}`,
      quantity: 1,
      price: commission.amount,
      total: commission.amount,
    }],
    subtotal: commission.amount,
    total: commission.amount,
    paymentStatus: commission.status,
  };
  
  return generator.generate(invoiceData);
};

export const generatePaymentReceipt = (payment: any): jsPDF => {
  const generator = new InvoiceGenerator();
  
  const invoiceData: InvoiceData = {
    invoiceNumber: `PAY-${payment.$id}`,
    date: new Date(payment.createdAt).toLocaleDateString('en-GB'),
    type: 'payment',
    customerName: payment.merchantName || 'Merchant',
    merchantName: payment.merchantName,
    items: [{
      description: 'Commission Payment',
      quantity: 1,
      price: payment.commissionAmount,
      total: payment.commissionAmount,
    }, {
      description: 'Platform Fee',
      quantity: 1,
      price: payment.platformFee,
      total: payment.platformFee,
    }],
    subtotal: payment.totalAmount,
    commission: payment.commissionAmount,
    platformFee: payment.platformFee,
    total: payment.totalAmount,
    paymentMethod: 'Bank Transfer',
    paymentStatus: payment.status,
  };
  
  return generator.generate(invoiceData);
};
