<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
     protected $fillable = ['variation_id', 'path', 'is_main'];

     public function variation()
    {
        return $this->belongsTo(ProductVariation::class, 'variation_id');
    }
}
