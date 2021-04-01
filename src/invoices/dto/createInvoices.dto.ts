export class CreateInvoicesDto {
    invoice_id?: string;
    payment_id: string;
    order_id: string;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    total_amount: number;
    sold_by: string;
}