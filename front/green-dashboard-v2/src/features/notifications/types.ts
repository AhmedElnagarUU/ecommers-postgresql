export interface Notification {
  _id: string;
  type: 'order_placed' | 'order_status_changed' | 'shipping_status_changed';
  title: string;
  message: string;
  data: {
    orderId?: string;
    orderNumber?: string;
    oldStatus?: string;
    newStatus?: string;
    customerName?: string;
    customerEmail?: string;
  };
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
