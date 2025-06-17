import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ShopComponent } from './features/shop/shop.component';
import { TestError } from './features/test-error/test-error';
import { NotFound } from './shared/components/not-found/not-found';
import { ServerError } from './shared/components/server-error/server-error';
import { Cart } from './features/cart/cart';
import { ProductDetailsComponent } from './features/shop/product-details/product-details';
import { Checkout } from './features/checkout/checkout';


export const routes: Routes = [
    {path: '', component: Home},
    {path: 'shop', component: ShopComponent},
    {path: 'shop/:id', component: ProductDetailsComponent},
    {path: 'cart', component: Cart},
    {path: 'checkout', component: Checkout},
    {path: 'test-error', component: TestError},
    {path: 'not-found', component: NotFound},
    {path: 'server-error', component: ServerError},
    {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];
