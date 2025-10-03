<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deparment extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'meta_title',
        'meta_description',
        'active',
    ];
}
