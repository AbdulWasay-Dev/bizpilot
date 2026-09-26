<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Post Model
 * Fields: business_id, platform_id, title, caption, first_comment, format, status, scheduled_at, posted_at, live_post_url, asset_paths
 */
class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        // TODO: add fillable fields based on migration
    ];

    protected $casts = [
        // TODO: add type casts (e.g., json, datetime, encrypted)
    ];
}
