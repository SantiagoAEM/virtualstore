<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CartService $cartService)
    {
       dd($cartService);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product, CartService $cartService)
    {
      $request->mergeIfMissing(['quantity' => 1]); // si la cantidad no se propporciona se establece en 1 por defecto

      $data = $request->validate([
        'quantity' => 'required|integer|min:1',
        'variation_id' => 'nullable|exists:product_variations,id',
      ]);
        $cartService->addItemToCart(
            $product, 
            $data['quantity'], 
            $data['variation_id'] ?? null
        );

        return back()->with('success', 'Product added to cart successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product, CartService $cartService)
    {
        $request-> validate([
            'quantity' => 'required|integer|min:1',
        ]);
        $variationIds = $request->input('variation_id'); // Obtener los IDs de variación si existen
        $quantities = $request->input('quantity'); // Obtiene las nuevas cantidades

        $cartService->updateItemQuantity($product->id, $variationIds ?? null, $quantities);

        return back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product, CartService $cartService)
    {
       $variationIds = $request->input('variation_id');
       
       $cartService->removeItemFromCart($product->id, $variationIds ?? null);

         return back()->with('success', 'Product removed from cart successfully.');


    }
}
