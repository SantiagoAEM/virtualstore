<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;


class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departments = Department::all();
        return  inertia('admin/department/Index', compact('departments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('admin/department/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $validated = $request->validate([
        'name' => 'required|string|min:3',
        'slug' => 'required|string|unique:departments,slug',
        'meta_title' => 'nullable|string',
        'meta_description' => 'nullable|string',
        'active' => 'boolean',
    ]);
   
   
    Department::create($validated);

    return redirect()->route('department.index')->with('success', 'Departmento creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $deparment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        return inertia('admin/department/Edit',compact('department'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'slug' => [
            'required',
            'string',
            Rule::unique('departments', 'slug')->ignore($department->id),
        ],
        'meta_title' => 'nullable|string',
        'meta_description' => 'nullable|string',
        'active' => 'boolean',
     ]);

        $department->update($data);

        return redirect()->route('department.index')->with('success', 'Deparmento actualizado correctamente');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        try{
        $department->delete();

        return redirect()->route('department.index')->with('success', 'Deparmento eliminado correctamente');

        }catch(\Exception $e){

            return redirect()->route('department.index')
            ->with('error', 'No puedes eliminar este departamento porque tiene categorías asociadas.
                             Elimina o reasigna esas categorías primero.');

        }
    }
}
