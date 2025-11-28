<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Resources\Frontend\ProductListResource;
use App\Http\Resources\ProductDetailResource;
use App\Models\Product;
use Illuminate\Support\Facades\Request;

class ProductResourceController extends Controller
{
    public function home()
    {
        $products = ProductListResource::collection(
            Product::with(['department', 'user'])->paginate(12)
        );
        return inertia('home', compact('products'));
    }
    public function show(Request $request, Product $product, $variationSlug = null)
    {
      /*   $variationId = $request->query('variation'); */

        $product->load('variations.images');

         // Buscar variación por slug
        $activeVariation = $variationSlug
        ? $product->variations->firstWhere('slug', $variationSlug)
        : $product->variations->first();

        return inertia('frontend/product/show', [ 
            'product' => new ProductDetailResource($product), 

             // Se envia la variación solicitada
              'activeVariationSlug' => $activeVariation ? $activeVariation->slug : null,
           /*  'activeVariationId' => $variationId */
        ]);
    }
}
