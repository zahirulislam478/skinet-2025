import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Shop } from '../../core/services/shop';
import { Product } from '../../shared/models/product';
import { MatCard } from '@angular/material/card';
import { ProductItem } from "./product-item/product-item";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialog } from './filters-dialog/filters-dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/ShopParams';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true, 
  imports: [
    ProductItem,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule
  ], 
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopService = inject(Shop);
  private dialogService = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private filterSubject = new Subject<{ brands: string[]; types: string[] }>();
  
  products?: Pagination<Product>;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'}
  ]

  shopParams = new ShopParams();
  pageSizeOptions = [5, 10, 15, 20];
  
  ngOnInit(): void {
    this.initializeShop();
    this.setupFilterSubscription();
  }

  private setupFilterSubscription() {
  this.filterSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(
      (prev, curr) =>
        JSON.stringify(prev.brands) === JSON.stringify(curr.brands) &&
        JSON.stringify(prev.types) === JSON.stringify(curr.types)
    )
  ).subscribe(({ brands, types }) => {
    this.shopParams.brands = brands; // Assuming you add these properties to ShopParams
    this.shopParams.types = types;
    this.getProducts();
  });
}

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response;
        this.cdr.detectChanges();
      },
      error: error => console.error(error)
    });
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];
    if(selectedOption){
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialog, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      }
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          this.getProducts();
        }
      }
    });
  }
}
