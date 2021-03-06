import { Component, Input, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../models/user";
import {ProductService} from "../../services/product.service";
import {ProductFilter} from "../../models/product-filter";

import { ProductsCollectionComponent } from "../products-collection/products-collection.component"

@Component({
    selector: "user-products",
    templateUrl: "./app/components/user-products/user-products.component.html",
    styleUrls: ["./app/components/user-products/user-products.component.css"]
})


export class UserProductsComponent extends ProductsCollectionComponent implements OnChanges{

    @Input() userId: number;
    @Input() currentProductId: number;
    @Output() productChanged: EventEmitter<string> = new EventEmitter();
    user: User;

    ngOnInit(): void {
        // Dehabilitamos el init del componentePadre (sobrecargándolo) para llamarlo cuando sólo cuando hay un cambio (ngOnchanges)
        // Si no implementamos el OnChanges y dejamos sólo el OnInit del Componente padre, solo funciona correctamente al recargar la pagina (Commnd + R)

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["currentProductId"] && changes["currentProductId"]["currentValue"]) {
            this.productChanged.emit();
            super.ngOnInit();
        }
    }

    filterCollection(filter: ProductFilter): void {
        let productsFilter : ProductFilter = { seller: this.userId, id: this.currentProductId};
        super.filterCollection(productsFilter);
    }
}

