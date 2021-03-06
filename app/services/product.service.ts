import { Inject, Injectable } from "@angular/core";
import { Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { Product } from "../models/product";
import { ProductFilter } from "../models/product-filter";
import { BackendUri } from "../app.settings";

@Injectable()
export class ProductService {

    constructor(
        @Inject(BackendUri) private _backendUri: string,
        private _http: Http) { }

    getProducts(filter: ProductFilter = undefined): Observable<Product[]> {

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pink Path                                                        |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos ordenados de más   |
        | reciente a menos, teniendo en cuenta su fecha de publicación.    |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo hacer |
        | la ordenación de los datos en tus peticiones, pero te ayudo      |
        | igualmente. La querystring debe tener estos parámetros:          |
        |                                                                  |
        |   _sort=publishedDate&_order=DESC                                |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Red Path                                                         |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos filtrados por      |
        | texto y/ por categoría.                                          |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo       |
        | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
        | querystring debe tener estos parámetros:                         |
        |                                                                  |
        |   - Búsqueda por texto:                                          |
        |       q=x (siendo x el texto)                                    |
        |   - Búsqueda por categoría:                                      |
        |       category.id=x (siendo x el identificador de la categoría)  |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Yellow Path                                                      |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
        | Pide al servidor que te retorne los productos filtrados por      |
        | estado.                                                          |
        |                                                                  |
        | En la documentación de 'JSON Server' tienes detallado cómo       |
        | filtrar datos en tus peticiones, pero te ayudo igualmente. La    |
        | querystring debe tener estos parámetros:                         |
        |                                                                  |
        |   - Búsqueda por estado:                                         |
        |       state=x (siendo x el estado)                               |
        |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

        let urlSearchParameters: URLSearchParams = new URLSearchParams(`_sort=publishedDate&_order=DESC`)

        if(filter) {
            if(filter.category) {
                urlSearchParameters.append("category.id", filter.category);
            }

            if(filter.text){
                urlSearchParameters.append("q", filter.text);
            }

            if(filter.state) {
                urlSearchParameters.append("state", filter.state);
            }

            if(filter.seller) {
                urlSearchParameters.append("seller.id", filter.seller.toString());
            }

            if(filter.id) {
                urlSearchParameters.append("id_ne", filter.id.toString());
            }

            if(filter.priceFrom) {
                urlSearchParameters.append("price_gte", filter.priceFrom.toString());
            }

            if(filter.priceTo) {
                urlSearchParameters.append("price_lte", filter.priceTo.toString());
            }

            if(filter.order && filter.order!=="0") {
                let typeOfOrder: string;
                let orderBy: string;

                if(filter.order === "1") {
                    typeOfOrder = "ASC"
                    orderBy="name";
                }
                else if(filter.order === "3") {
                    typeOfOrder = "ASC"
                    orderBy="price";
                } else if(filter.order === "2"){
                    typeOfOrder = "DESC"
                    orderBy="name";
                } else if(filter.order === "4"){
                    typeOfOrder = "DESC";
                    orderBy="price";

                }
                urlSearchParameters.set("_sort", orderBy);
                urlSearchParameters.set("_order", typeOfOrder);
            }
        }


        let options = new RequestOptions({
            search: urlSearchParameters
        });

        return this._http
                   .get(`${this._backendUri}/products`, options)
                   .map((data: Response): Product[] => Product.fromJsonToList(data.json()));
    }

    getProduct(productId: number): Observable<Product> {
        return this._http
                   .get(`${this._backendUri}/products/${productId}`)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }

    buyProduct(productId: number): Observable<Product> {
        let body: any = { "state": "sold" };
        return this._http
                   .patch(`${this._backendUri}/products/${productId}`, body)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }

    setProductAvailable(productId: number): Observable<Product> {
        let body: any = { "state": "selling" };
        return this._http
                   .patch(`${this._backendUri}/products/${productId}`, body)
                   .map((data: Response): Product => Product.fromJson(data.json()));
    }
}
