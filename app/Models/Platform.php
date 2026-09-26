<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Platform Model
 * Fields: business_id, type, handle, profile_url, formats, weekly_target, char_limit, hashtag_limit, video_length_limit
 */
class Platform extends Model
{
    use HasFactory;

    protected $fillable = [
        // TODO: add fillable fields based on migration
    ];

    protected $casts = [
        // TODO: add type casts (e.g., json, datetime, encrypted)
    ];
}
