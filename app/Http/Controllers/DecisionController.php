<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DecisionController extends Controller
{
    public function index()
    {
        return Inertia::render('Decisions/Index', [
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
