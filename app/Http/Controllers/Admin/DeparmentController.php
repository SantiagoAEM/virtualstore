<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deparment;
use Illuminate\Http\Request;

use function Termwind\render;

class DeparmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return  inertia('admin/deparment/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Deparment $deparment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deparment $deparment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Deparment $deparment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deparment $deparment)
    {
        //
    }
}
