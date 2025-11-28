<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'department' => [
                'id' => $this->department->id,
                'name' => $this->department->name,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'variations' => $this->variations->map(function ($variation) {
                return [
                    'id' => $variation->id,
                    'name' => $variation->name,
                    'slug' => $variation->slug,
                    'type' => $variation->type,
                    'code' => $variation->code,
                    'price' => $variation->price,
                    'quantity' => $variation->quantity,
                    'images' => $variation->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'url' => asset('storage/' . $image->path),
                            'thumbnail' => $image->thumbnail_path 
                                ? asset('storage/' . $image->thumbnail_path)
                                : asset('storage/' . $image->path),
                            'is_main' => $image->is_main,
                        ];
                    }),                   
                ];
            }),
        ];
    }
}