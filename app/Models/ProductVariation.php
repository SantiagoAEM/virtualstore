<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductVariation extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'type', 
        'code',
        'price',
        'quantity',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'variation_id');
    }

    public function getSlugAttribute()
{
    return Str::slug($this->name);
}

}
 