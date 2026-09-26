<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * InventoryItem Model
 * Fields: business_id, vendor_id, sku, title, category, secret_payload, unit_cost, retail_price, status, purchased_at, sold_at, customer_order_ref
 */
class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        // TODO: add fillable fields based on migration
    ];

    protected $casts = [
        // TODO: add type casts (e.g., json, datetime, encrypted)
    ];
}
