<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Resources\Frontend\ProductListResource;
use App\Http\Resources\ProductDetailResource;
use App\Models\Product;


class ProductResourceController extends Controller
{
    public function home()
    {
        $products = ProductListResource::collection(
            Product::with(['department', 'user'])->paginate(12)
        );
        return inertia('home', compact('products'));
    }
    public function show(Product $product)
    {
        return inertia('frontend/product/show', [ 
            'product' => new ProductDetailResource($product), 
            'variations' => request('options',[])
        ]);
    }
}
