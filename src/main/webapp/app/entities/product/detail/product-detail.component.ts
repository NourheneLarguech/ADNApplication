import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';

import { IProduct } from '../product.model';

@Component({
  selector: 'jhi-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product: IProduct | null = null;
  //private ProductService: any;
  ResProduct:any;
  resGetUpdate:any;
  constructor(protected activatedRoute: ActivatedRoute,protected productService:ProductService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
      console.log('**********');
      this.productService.getProduct(product).subscribe(ResProduct=>{this.ResProduct=ResProduct},error => {console.log(error)})
     this.productService.getUpdate().subscribe(resGetUpdate=>
     {this.resGetUpdate=resGetUpdate})
    });

  }
  NameCalculator(name?:string):string|undefined{
    return name?.substring(0,name.indexOf('_'))
  }
  NameVersion(name?:string):string|undefined{
    return name?.substring((name.indexOf('_'))+1,(name.length));
  }
  previousState(): void {
    window.history.back();
  }
}
