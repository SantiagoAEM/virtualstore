<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Department;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::all();
        $categories = Category::all();
        $products = Product::with(['department', 'category']) //carga las relaciones  en products
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        return  inertia('vendors/products/index', compact('products', 'categories', 'departments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();
        $categories = Category::all();
        return inertia('vendors/products/create', compact('categories', 'departments'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $data = $request->all();
        $data['created_by'] = $user->id;
        $data['updated_by'] = $user->id;

        $validated = Validator::make($data, [

            'title' => 'required|string|min:3',
            'slug' => 'nullable|string',
            'department_id' => 'required|integer|exists:departments,id',
            'category_id' => 'nullable|integer|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'status' => 'required|in:draft,published',
            'created_by' => 'required|integer|exists:users,id',
            'updated_by' => 'required|integer|exists:users,id',

        ])->validate();

        Product::create($validated);

        return redirect()->route('products.index')->with('success', 'Product created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $product->load(['department', 'category', 'variations.images']);
        $departments = Department::all();
        $categories = Category::all();
        return inertia('vendors/products/edit', compact('product', 'categories', 'departments'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $user = Auth::user();
        $data['updated_by'] = $user->id;
        $data = $request->validate([

            'title' => 'required|string|min:3',
            'slug' => 'nullable|string',
            'department_id' => 'required|integer|exists:departments,id',
            'category_id' => 'nullable|integer|exists:categories,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'status' => 'required|in:draft,published',
        ]);
        $user = Auth::user();
        $data['updated_by'] = $user->id;

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
   {
    // Cargar variaciones con sus imágenes
    $product->load('variations.images');

    // Obtener el directorio principal del producto
    $productDir = null;
    foreach ($product->variations as $variation) {
        if ($variation->images->isNotEmpty()) {
            $firstImagePath = $variation->images->first()->path;
            // Extraer el directorio principal del producto: products/{nombre-producto}
            $productDir = implode('/', array_slice(explode('/', $firstImagePath), 0, 2));
            break; // con la primera imagen basta
        }
    }

    // Eliminar todo el directorio del producto si existe
    if ($productDir && Storage::disk('public')->exists($productDir)) {
        Storage::disk('public')->deleteDirectory($productDir);
    }

    // Eliminar todas las imágenes de las variaciones en BD
    foreach ($product->variations as $variation) {
        $variation->images()->delete();
    }

    // Eliminar las variaciones
    $product->variations()->delete();

    // Finalmente eliminar el producto
    $product->delete();

    return redirect()->route('products.index')->with('success', 'Product and all related images/directories deleted successfully.');
}
}