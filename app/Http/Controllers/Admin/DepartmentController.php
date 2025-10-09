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
        $departments = Department::paginate(5);
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
    ]);

    Department::create($validated);

    return redirect()->route('department.index')->with('success', 'Department created successfully');
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
     ]);

        $department->update($data);

        return redirect()->route('department.index')->with('success', 'Deparment updated successfully');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->route('department.index')->with('success', 'Deparment deleted successfully');

    }
}
