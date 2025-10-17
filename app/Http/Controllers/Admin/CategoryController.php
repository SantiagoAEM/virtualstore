<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $allCategories = Category::with(['department', 'parent'])
        ->orderBy('name')
        ->get();

    $categories = $this->organizeCategories($allCategories);

    $departments = Department::all();

    return inertia('admin/categories/index', compact('categories', 'departments'));
}

private function organizeCategories($categories)
{
    $grouped = $categories->groupBy('parent_id');

    $sorted = collect();

    // Primero los padres (parent_id = null)
    foreach ($grouped[null] ?? [] as $parent) {
        $sorted->push($parent);

        // Luego los hijos
        foreach ($grouped[$parent->id] ?? [] as $child) {
            $sorted->push($child);
        }
    }

    return $sorted->values(); // Devuelve la colección limpia
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();
        $categories = Category::whereNull('parent_id')->get(); 
        return inertia('admin/categories/create',compact('categories','departments'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();

    // ⚠️ Convertir antes de validar
    if (isset($data['parent_id']) && $data['parent_id'] == 0) {
        $data['parent_id'] = null;
    }

    $validated = Validator::make($data, [
        'name' => 'required|string|min:3',
        'active' => 'boolean',
        'parent_id' => 'nullable|integer|exists:categories,id',
        'department_id' => 'integer',
    ])->validate();

    Category::create($validated);

    return redirect()->route('categories.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
         $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully');
    }
}
