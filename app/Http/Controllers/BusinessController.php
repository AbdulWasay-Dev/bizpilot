<?php

namespace App\Http\Controllers;

use App\Models\Business;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessController extends Controller
{
    /**
     * Global Command Center — all businesses overview.
     */
    public function index()
    {
        return Inertia::render('CommandCenter/Index', [
            'businesses' => Business::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('CommandCenter/Create');
    }

    public function store(Request $request)
    {
        // TODO: validate and create business
    }

    public function show(Business $business)
    {
        return Inertia::render('CommandCenter/Show', [
            'business' => $business,
        ]);
    }

    public function edit(Business $business)
    {
        return Inertia::render('CommandCenter/Edit', [
            'business' => $business,
        ]);
    }

    public function update(Request $request, Business $business)
    {
        // TODO: validate and update business
    }

    public function destroy(Business $business)
    {
        // TODO: delete business
    }
}
