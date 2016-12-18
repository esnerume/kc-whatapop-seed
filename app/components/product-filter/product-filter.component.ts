import { Component, EventEmitter, OnInit, OnDestroy, Output } from "@angular/core";
import { Subscription } from "rxjs/Rx";

import { Category } from "../../models/category";
import { CategoryService } from "../../services/category.service";
import { ProductFilter } from "../../models/product-filter";

@Component({
    selector: "product-filter",
    templateUrl: "./app/components/product-filter/product-filter.component.html",
    styleUrls: ["./app/components/product-filter/product-filter.component.css"]
})
export class ProductFilterComponent implements OnInit, OnDestroy {

    @Output() onSearch: EventEmitter<ProductFilter> = new EventEmitter();
    private _productFilter: ProductFilter = {};
    private _categories: Category[];
    private _states: any [] = [{key: "En venta", value: "selling"},{key: "Vendido", value: "sold"}];
    private _order: any [] = [{key: 'Ordenar por Defecto', value: "0"},
                              {key: 'Ordenar Alfabeticamente Ascendente', value: "1"},
                              {key: 'Ordenar Alfabeticamente Descendente', value: "2"},
                              {key: 'Ordenar Precio Ascendente', value: '3'},
                              {key: 'Ordenar Precio Descendente', value: '4'}]

    private _categoriesSubscription: Subscription;

    constructor(private _categoryService: CategoryService) { }

    ngOnInit(): void {
        this._categoriesSubscription = this._categoryService
                                           .getCategories()
                                           .subscribe((data: Category[]) => this._categories = data);
    }

    ngOnDestroy(): void {
        this._categoriesSubscription.unsubscribe();
    }

    notifyHost(): void {
        this.onSearch.emit(this._productFilter);
    }
}
