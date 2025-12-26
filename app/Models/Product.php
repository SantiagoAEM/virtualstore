<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Product extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'department_id',
        'category_id',
        'description',
        'price',
        'quantity',
        'status',
        'created_by',
        'updated_by'
    ];



    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }


    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }


    public function scopeForVendor($query): Builder
    {
        return $query->where('created_by', Auth::id());
    }

    public function scopePublished($query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopeForwebsite($query): Builder
    {
        return $query->published();
    }
    
}
