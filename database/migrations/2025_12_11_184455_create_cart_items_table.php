<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->index()
                ->constrained('products')
                ->onDelete('cascade');
            $table->foreignId('user_id')
                ->nullable()
                ->index()
                ->constrained('users');
            $table->json('variation_ids')->nullable();
            $table->integer('quantity');
            $table->decimal('price', 20, 2);
            $table->boolean('saved_for_later')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
