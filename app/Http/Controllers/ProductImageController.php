<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProductColor;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductImageController extends Controller
{
public function upload(Request $request, ProductColor $color)
    {
        $request->validate([
            'images.*' => 'required|image|max:2048',
        ]);

        // Crear instancia del ImageManager con el driver deseado
        $manager = new ImageManager(new Driver());

        $productName = $color->product->name;
        $productSlug = Str::slug($productName);

        foreach ($request->file('images') as $file) {
            // Leer y procesar la imagen
            $image = $manager->read($file);
            
            // Redimensionar manteniendo proporción (cover fit)
            $image->cover(800, 800);
            
            // Codificar a WebP con calidad 90
            $encoded = $image->toWebp(quality: 90);

            $path = 'products/' . $productSlug . $color->id . '/' . uniqid() . '.webp';
            Storage::disk('public')->put($path, (string) $encoded);

            ProductImage::create([
                'product_color_id' => $color->id,
                'path' => $path,
                'is_main' => false,
            ]);
        }

        return back()->with('success', 'Imágenes subidas correctamente.');
    }

    public function setMainImage(ProductImage $image)
    {
        ProductImage::where('product_color_id', $image->product_color_id)
            ->update(['is_main' => false]);

        $image->update(['is_main' => true]);

        return back()->with('success', 'Imagen principal actualizada.');
    }

    public function destroy(ProductImage $image)
    {
        Storage::disk('public')->delete($image->path);
        $image->delete();

        return back()->with('success', 'Imagen eliminada.');
    }



}
