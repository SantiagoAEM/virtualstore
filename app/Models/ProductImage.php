<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
     protected $fillable = ['variation_id', 'path', 'thumbnail_path', 'is_main'];
     
     public function variation()
    {
        return $this->belongsTo(ProductVariation::class, 'variation_id');
    }


     public function getUrlAttribute()
    {
        return asset('storage/' . $this->path);
    }

      public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail_path ? asset('storage/' . $this->thumbnail_path) : $this->url;
    }

    
}
  