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
// Ya no necesitamos WebpEncoder, lo eliminamos si no se usa en otro lugar
// use Intervention\Image\Encoders\WebpEncoder; 

class ProductImageController extends Controller 
{
    public function upload(Request $request, ProductVariation $variation)
    {
        $request->validate([
            'images.*' => 'required|image|max:10240', // Máximo 10MB por imagen
        ]);

        $manager = new ImageManager(new Driver());

        $productName = $variation->product->title ?? 'product';
        $productSlug = Str::slug($productName);
        
        $variationSlug = Str::slug($variation->name . '-' . $variation->type);

        $existingImagesCount = ProductImage::where('variation_id', $variation->id)->count();
        $isFirstImage = $existingImagesCount === 0;

        $finalSize = 2000; 
        $thumbSize = 300;

        foreach ($request->file('images') as $index => $file) {
            $uniqueId = uniqid();

            //      IMAGEN PRINCIPAL
            $image = $manager->read($file);
            $image = $this->makeSquareWithWhiteBackground($image, $finalSize);
            $image->sharpen(10);
            $image->cover($finalSize, $finalSize);

            // 💡 SOLUCIÓN: Usar toWebp() con solo la calidad (int)
            $encoded = $image->toWebp(82); // Calidad 82

            $path = "products/{$productSlug}/{$variationSlug}/{$uniqueId}.webp";
            Storage::disk('public')->put($path, (string) $encoded);

            //         THUMBNAIL
            $thumbnail = $manager->read($file);
            $thumbnail = $this->makeSquareWithWhiteBackground($thumbnail, $thumbSize);
            $thumbnail->sharpen(8);
            $thumbnail->cover($thumbSize, $thumbSize);

       
            $thumbEncoded = $thumbnail->toWebp(78); // Calidad 78

            $thumbnailPath = "products/{$productSlug}/{$variationSlug}/{$uniqueId}_thumb.webp";
            Storage::disk('public')->put($thumbnailPath, (string) $thumbEncoded);

            //     GUARDAR EN BASE
            $isMain = $isFirstImage && $index === 0;

            ProductImage::create([
                'variation_id' => $variation->id,
                'path' => $path,
                'thumbnail_path' => $thumbnailPath,
                'is_main' => $isMain,
            ]);
        }

        return back()->with('success', 'Imágenes subidas correctamente.');
    }

    private function makeSquareWithWhiteBackground($image, $size)
    {
        $width = $image->width();
        $height = $image->height();
        $maxSide = max($width, $height);

        $canvas = (new ImageManager(new Driver()))
            ->create($maxSide, $maxSide, '#FFFFFF');

        $canvas->place($image, 'center');
        $canvas->resize($size, $size);

        return $canvas;
    }

    public function setMainImage(ProductImage $image)
    {
        ProductImage::where('variation_id', $image->variation_id)
            ->update(['is_main' => false]);
        $image->update(['is_main' => true]);

        return back()->with('success', 'Imagen principal actualizada.');
    }

    public function destroy(ProductImage $image)
    {
        $variationId = $image->variation_id;
        $wasMain = $image->is_main;

        Storage::disk('public')->delete($image->path);
        Storage::disk('public')->delete($image->thumbnail_path); 
        $image->delete();

        if ($wasMain) {
            $nextImage = ProductImage::where('variation_id', $variationId)->first();
            if ($nextImage) {
                $nextImage->update(['is_main' => true]);
            }
        }

        return back()->with('success', 'Imagen eliminada correctamente.');
    }
}