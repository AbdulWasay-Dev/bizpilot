<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Transaction Model
 * Fields: business_id, type, subtype, amount, category, description, transaction_date, inventory_item_id, vendor_id, reference_order_id, receipt_path
 */
class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        // TODO: add fillable fields based on migration
    ];

    protected $casts = [
        // TODO: add type casts (e.g., json, datetime, encrypted)
    ];
}
