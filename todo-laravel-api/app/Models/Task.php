<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Liberando essas colunas para serem preenchidas via API
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status'
    ];
}
