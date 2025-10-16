<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
   protected $fillable = [
        'name',
        'department_id',
        'parent_id',
        'active',
    ];

public function department()
{
    return $this->belongsTo(Department::class);
}

public function parent()
{
    return $this->belongsTo(Category::class, 'parent_id');
}
}
