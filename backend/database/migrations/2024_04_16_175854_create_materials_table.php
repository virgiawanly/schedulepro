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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index()->unique();
            $table->foreignId('company_id')->nullable()->index();
            $table->foreignId('location_id')->nullable()->index();
            $table->string('name')->nullable()->index();
            $table->text('description')->nullable();
            $table->string('uom')->nullable();
            $table->decimal('price', 28, 2)->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->nullable()->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
