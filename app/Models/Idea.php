<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Idea Model
 * Fields: business_id, title, note_content, category, impact_score, confidence_score, ease_score, converted_to_type
 */
class Idea extends Model
{
    use HasFactory;

    protected $fillable = [
        // TODO: add fillable fields based on migration
    ];

    protected $casts = [
        // TODO: add type casts (e.g., json, datetime, encrypted)
    ];
}
