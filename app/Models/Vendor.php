<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Vendor Model
 * Fields: business_id, name, alias, phone, whatsapp_link, telegram_handle, portal_url, payment_methods, reliability_rating, notes
 */
class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        // TODO: add fillable fields based on migration
    ];

    protected $casts = [
        // TODO: add type casts (e.g., json, datetime, encrypted)
    ];
}
