<?php

namespace App\Http\Controllers\ContentStudio;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlatformController extends Controller
{
    public function index()
    {
        return Inertia::render('Content/Platforms', [
            // TODO: pass data
        ]);
    }

    public function store(Request $request)
    {
        // TODO: validate and store
    }

    public function update(Request $request, $id)
    {
        // TODO: validate and update
    }

    public function destroy($id)
    {
        // TODO: delete
    }
}
