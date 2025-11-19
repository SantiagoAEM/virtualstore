<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductVariationController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'type' => 'required|string|in:color,size,style,type',
            'code' => 'nullable|string|max:20',
            'price' => 'nullable|numeric|min:0',
            'quantity' => 'nullable|integer|min:0',
        ]);

        $product->variations()->create($data);

        return back()->with('success', 'Variación agregada correctamente.');
    }

    public function update(Request $request, ProductVariation $variation)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'type' => 'required|string|in:color,size,style,type',
            'code' => 'nullable|string|max:20',
            'price' => 'nullable|numeric|min:0',
            'quantity' => 'nullable|integer|min:0',
        ]);

        $variation->update($data);

        return back()->with('success', 'Variación actualizada correctamente.');
    }

    public function destroy(ProductVariation $variation)
    {   
         // Si la variación tiene imágenes
    if ($variation->images->isNotEmpty()) {

        // Obtener el directorio base de la primera imagen
        $firstImagePath = $variation->images->first()->path;
        $variationDir = dirname($firstImagePath);

        // Eliminar todas las imágenes del disco
        foreach ($variation->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        // Eliminar el directorio completo de la variación
        Storage::disk('public')->deleteDirectory($variationDir);
    }

    // Eliminar registros en BD
    $variation->images()->delete();

    // Eliminar la variación
    $variation->delete();

    return back()->with('success', 'Variación eliminada correctamente.');
}
}