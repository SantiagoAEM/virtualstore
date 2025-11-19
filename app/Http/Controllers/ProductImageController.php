<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use App\Models\ProductVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductImageController extends Controller
{
    public function upload(Request $request, ProductVariation $variation)
    {
        $request->validate([
            'images.*' => 'required|image|max:2048',
        ]);

        // Crear instancia del ImageManager con el driver deseado
        $manager = new ImageManager(new Driver());

        $productName = $variation->product->title ?? 'product';
        $productSlug = Str::slug($productName);
        
        // Crear slug de la variante (nombre + tipo)
        $variationSlug = Str::slug($variation->name . '-' . $variation->type);

        // Verificar si ya existen imágenes para esta variación
        $existingImagesCount = ProductImage::where('variation_id', $variation->id)->count();
        $isFirstImage = $existingImagesCount === 0;

        foreach ($request->file('images') as $index => $file) {
            // Leer y procesar la imagen
            $image = $manager->read($file);
            
            // Redimensionar manteniendo proporción (cover fit)
            $image->cover(800, 800);
            
            // Codificar a WebP con calidad 90
            $encoded = $image->toWebp(quality: 90);

            // Estructura: products/{product-slug}/{variation-slug}/imagen.webp
            $path = 'products/' . $productSlug . '/' . $variationSlug . '/' . uniqid() . '.webp';
            Storage::disk('public')->put($path, (string) $encoded);

            // La primera imagen subida será marcada como principal
            $isMain = $isFirstImage && $index === 0;

            ProductImage::create([
                'variation_id' => $variation->id,
                'path' => $path,
                'is_main' => $isMain,
            ]);
        }

        return back()->with('success', 'Imágenes subidas correctamente.');
    }

    public function setMainImage(ProductImage $image)
    {
        // Quitar is_main de todas las imágenes de la misma variación
        ProductImage::where('variation_id', $image->variation_id)
            ->update(['is_main' => false]);

        // Marcar la imagen seleccionada como principal
        $image->update(['is_main' => true]);

        return back()->with('success', 'Imagen principal actualizada.');
    }

    public function destroy(ProductImage $image)
    {
        // Guardar información antes de eliminar
        $variationId = $image->variation_id;
        $wasMain = $image->is_main;

        // Eliminar archivo físico
        Storage::disk('public')->delete($image->path);
        
        // Eliminar registro de la base de datos
        $image->delete();

        // Si era la imagen principal, marcar la siguiente imagen como principal
        if ($wasMain) {
            $nextImage = ProductImage::where('variation_id', $variationId)->first();
            if ($nextImage) {
                $nextImage->update(['is_main' => true]);
            }
        }

        return back()->with('success', 'Imagen eliminada correctamente.');
    }
}