<?php

namespace App\Http\Resources\Frontend;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //Obtiene la imagen principal carcada como (main) 
        $defaultVariation = $this->variations->first();
        $mainImage = $defaultVariation?->images->firstWhere('is_main', true)
            ?? $defaultVariation?->images->first();
        $imageUrl = $mainImage
            ? asset('storage/' . $mainImage->path)
            // si no hay imagenes cargadas toma el placeholder.png
            : asset('storage/placeholder.png');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'status' => $this->status,
            'image' => $imageUrl,
            'department' => $this->whenLoaded('department', function () {
                return [
                    'id' => $this->department->id,
                    'name' => $this->department->name,
                ];
            }),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                ];
            }),

        ];
    }
}
