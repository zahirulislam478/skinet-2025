import { inject, Injectable } from '@angular/core';
import { CartService } from './cart';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Init {
  private cartService = inject(CartService);

  init(){
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return cart$;
  }
}
