<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class UploadImageController extends Controller
{
      public function uploadform(){
        return inertia('vendors/products/uploadform');
    }

    public function uploadimage(Request $request){

    
        $request->validate([
            'image' => ['required', 'image', 'max:5120'], // 5MB
        ]);

        $file = $request->file('image');

        $filename = 'images/' . uniqid() . '.' . $file->getClientOriginalExtension();
        $image = Image::read($file)->resize(500, 400, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        $path = storage_path('app/public/products/' . $filename);
        $image->save($path);
        


        return back()->with('success', 'Imagen subida correctamente.');
    }
}
