<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;

class CartService
{
    private ?array $cachedCartItems = null;
    protected const CART_COOKIE_NAME = 'cart_items';
    protected const CART_COOKIE_EXPIRATION = 60 * 24 * 365; // 1 year

    public function addItemToCart(Product $product, int $quantity, ?int $variationId = null)
    {
        // Lógica para agregar el producto al carrito
    }

    public function updateItemQuantity($productId, $variationIds = null, $quantities)
    {
        // Lógica para actualizar la cantidad del producto en el carrito
    }

    public function removeItemFromCart($productId, $variationIds = null)
    {
        // Lógica para eliminar el producto del carrito
    }


        // Lógica para obtener los artículos del carrito (desde la base de datos o cookies)
        // y almacenarlos en $this->cachedCartItems
    public function getCartItems(): array
{
   try {
    if ($this->cachedCartItems === null) {
       if (Auth::check()) { //Si el usuario esta logueado obtiene la informacion de la BD
        $cartItems = $this->getCartItemsFromDatabase();
       } else {// Si el usuario no esta logueado obtiene la informaciond de las cookies
        $cartItems = $this->getCartItemsFromCookie();
       }

       $productIds = collect($cartItems)->map(fn($item) => $item['product_id']);
       $products = Product::whereIn('id', $productIds)
            ->with('user.vendor')
            ->forWebsite()
            ->get()
            ->keyBy('id');

        $cartItemData =[];

        foreach ($cartItems as $cartItem){
            $product = data_get($products, $cartItem['product_id']);
            if (!$product) continue;

            $optionInfo = [];
            $options = ProductVariation::with('product_id')
            ->whereIn('id',$cartItem['option_ids'])
            ->get();

            $imageUrl = null;
        
            foreach ($cartItem['options_ids'] as $option_id){
                $option = data_get($options, $option_id);

                if (!$imageUrl) {
                    $imageUrl = $option->getFirstMediaUrl('thumbnail');
                }
                $optionInfo[] = [
                    
                   'id' => $option->id,
                   'name' => $option->name,
                   'type' => $option->type ?? null,

                ];
            }

            $cartItemData[] = [
                'id' => $cartItem['id'],
                'product_id' => $product -> id,
                'title' => $product -> title,
                'slug' => $product->slug,
                'quantity' => $cartItem['quantity'],
                'price' => $cartItem['price'],
                'variation_options' => $variationsIds,
                'options_info' => $optionsInfo,
                'image' => $imageUrl ?: $product->getFirstImageUrl('thumbnail'),
                'user' => [
                   'id' => $product->created_by,
                   'name' => $product->user->vendor->store_name ?? null,
                   'vendor' => $product->user->vendor,
                ], 

            ];


        }
       
    }

    return $this->cachedCartItems;

   } catch (\Exception $e) {
    
   }
}

    public function getTotalQuantity(): int
    {
       $totalQuantity = 0;
       foreach ($this->getCartItems() as $item) {
           $totalQuantity += $item['quantity'];
       }
       return $totalQuantity;
    }

    public function getTotalPrice(): float
    {
        $totalPrice = 0;
        foreach ($this->getCartItems() as $item) {
            $totalPrice += $item['price'] * $item['quantity'];
        }
        return $totalPrice;
    }

    protected function updateItemQuantityInDatabase(int $productId, array $variationIds, int $quantities): void
    {
        $userId = Auth::id();

        $cartItems = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_ids', json_encode($variationIds))
            ->first();
        if ($cartItems) {
            $cartItems->update([
                'quantity' => $quantities
            ]);
        }   
    }

    protected function updateItemQuantityInCookie(int $productId, array $variationIds, int $quantities): void
    {
        $cartItems = $this->getCartItemsFromCookie();
        ksort($variationIds);

       $itemKey = $productId . '_' . json_encode($variationIds);
       
       if (isset($cartItems[$itemKey])){
            $cartItems[$itemKey]['quantity'] = $quantities;
       }

       Cookie::queue(self::CART_COOKIE_NAME, json_encode($cartItems), self::CART_COOKIE_EXPIRATION);
    }

    Protected function saveItemToDatabase(int $productId, array $variationIds, int $quantities): void
    {
        $userId = Auth::id();
        ksort($variationIds);

        $cartItems = CartItem::where('user_id',$userId)
        ->where('prduct_id',$productId)
        ->where('product_variations',json_encode($variationIds))
        ->first();

        if ($cartItems){
            $cartItems->update([
                'quantity' => DB::raw('quantity +' . $quantities )
            ]);
        } else{
            CartItem::create([
                'user_id' =>$userId,
                'product_id' => $productId,
                'quantity' => $quantities,
                'price' => $price, 
                'type' => $variationIds
            ]);
        }
    }
    Protected function saveItemToCookie(int $productId, array $variationIds, int $quantities ): void
    {
        $cartItems = $this->getCartItemsFromCookie();
        ksort($variationIds);

        $itemKey = $productId . '_' . json_encode($variationIds);

        if (isset($cartItems[$itemKey])) {
            # code...
        } else {
            # code...
        }
        
    }

    protected function removeItemFromDatabase(int $productId, array $variationIds, int $quantities ): void
    {
        // Lógica para eliminar el artículo de la base de datos
    }
    protected function removeItemFromCookie(int $productId, array $variationIds, int $quantities ): void
    {
        // Lógica para eliminar el artículo de la cookie
    }

    protected function getCartItemsFromDatabase()
    {
        // Lógica para obtener los artículos del carrito desde la base de datos
    }
    protected function getCartItemsFromCookie()
    {
        // Lógica para obtener los artículos del carrito desde la cookie
    }
}
