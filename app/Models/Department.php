<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Department extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'meta_title',
        'meta_description',
        'active',
    ];

    protected $casts = [
    'active' => 'boolean',
];

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }
}
