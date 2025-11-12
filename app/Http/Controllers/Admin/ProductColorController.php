<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductColor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductColorController extends Controller
{
    public function store(Request $request, Product $product)
    {

        $data = $request->validate([
            'color_name' => 'required|string|max:50',
            'color_code' => 'required|string|max:10',
        ]);

        $color = $product->colors()->create($data);





        return redirect()->back()->with('success', 'Color agregado correctamente');
    }

    public function destroy(ProductColor $color)
    {
        foreach ($color->images as $image) {

            if ($image->path && Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }

            $image->delete();
        }

        // Elimina carpeta completa del color
        $productSlug = Str::slug($color->product->title ?? 'product');
        $folder = 'products/' . $productSlug . $color->id;
        if (Storage::disk('public')->exists($folder)) {
            Storage::disk('public')->deleteDirectory($folder);
        }

        $color->delete();

        return redirect()->back()->with('success', 'Color eliminado correctamente');
    }
}
