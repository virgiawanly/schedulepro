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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index()->unique();
            $table->string('name')->nullable()->index();
            $table->string('slug')->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable()->index();
            $table->string('website')->nullable();
            $table->string('logo')->nullable();
            $table->boolean('is_active')->nullable()->default(1);
            $table->foreignId('owner_id')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
