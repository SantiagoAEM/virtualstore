<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
     protected $fillable = ['product_color_id', 'path', 'is_main'];

    public function color()
    {
        return $this->belongsTo(ProductColor::class, 'product_color_id');
    }
}
