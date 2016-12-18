import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { ConfirmationService } from "primeng/primeng";

import { Product } from "../../models/product";
import { ProductService } from "../../services/product.service";

@Component({
    templateUrl: "./app/components/product-detail/product-detail.component.html",
    styleUrls: ["./app/components/product-detail/product-detail.component.css"]
})
export class ProductDetailComponent implements OnDestroy, OnInit {

    private _product: Product;
    private _productSubscription: Subscription;
    like: string = "¿ Te gusta ?";
    private _prefix: string = "whatapop_";

    constructor(
        private _productService: ProductService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this._route.data.forEach((data: { product: Product }) => this._product = data.product);
        if (typeof(Storage) !== "undefined") {
            this.setLikeStatus(this._product.id.toString());
        }
        window.scrollTo(0, 0);
    }

    private setLikeStatus(productId: string) {
        let lsProduct:string = localStorage.getItem(`${this._prefix}${this._product.id.toString()}`);
        if(lsProduct && lsProduct == 'Me gusta') {
            this.like = lsProduct;
        } else {
            this.like = "¿ Te gusta ?";
        }
    }

    productChanged(): void {
        this.setLikeStatus(this._product.id.toString());
    }

    ngOnDestroy(): void {
        if (this._productSubscription !== undefined) {
            this._productSubscription.unsubscribe();
        }
    }

    private _buyProduct(): void {
        this._productSubscription = this._productService
                                        .buyProduct(this._product.id)
                                        .subscribe(() => this._showPurchaseConfirmation())
    }

    private _showPurchaseConfirmation(): void {
        this._confirmationService.confirm({
            rejectVisible: false,
            message: "Producto comprado. ¡Enhorabuena!",
            accept: () => this._router.navigate(["/product"])
        });
    }

    toogleLike(): void {
         if(this.like === "Me gusta") {
             this.like = "¿ Te gusta ?";
             localStorage.removeItem(`${this._prefix}${this._product.id}`);
         } else {
             this.like = "Me gusta";
             localStorage.setItem( `${this._prefix}${this._product.id}`, this.like);
         }
    }

    getLikeText(): string {;
        return this.like;
    }

    getImageSrc(): string {
        return this._product && this._product.photos.length > 0 ? this._product.photos[0] : "";
    }

    showPurchaseWarning(): void {
        this._confirmationService.confirm({
            message: `Vas a comprar ${this._product.name}. ¿Estás seguro?`,
            accept: () => this._buyProduct()
        });
    }

    goBack(): void {
        window.history.back();
    }

}
