<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Product::all();
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
        $request->validate([
            'product_name' => 'required|max:150',
            'category' => 'required|max:100',
            'price' => 'required|numeric',
        ]);
    
        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Product::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
    $product = Product::findOrFail($id);  // Pastikan ID produk ditemukan
    $request->validate([
        'product_name' => 'required|max:150',
        'category' => 'required|max:100',
        'price' => 'required|numeric',
    ]);

    $product->update($request->all());  // Update data produk
    return response()->json($product, 200);  // Kembalikan data produk yang sudah diupdate
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

}
