export interface ProductFilter {
    text?: string;
    category?: string;
    state?: string;
    seller?: number;
    id?: number;
    order?: string;
    priceFrom? : number;
    priceTo?: number;
}
