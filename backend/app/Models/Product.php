<?php

namespace App\Models;

use App\Traits\AutoGenerateUuid;
use App\Traits\ScopedByCompanyAndLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends BaseModel
{
    use HasFactory, SoftDeletes, ScopedByCompanyAndLocation, AutoGenerateUuid;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'products';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'company_id',
        'location_id',
        'name',
        'description',
        'price',
        'is_active',
    ];

    /**
     * The attributes that are searchable in the query.
     *
     * @var array<int, string>
     */
    protected $searchables = [
        'name',
        'description',
        'price',
        'is_active',
    ];

    /**
     * The columns that are searchable in the query.
     *
     * @var array<string, string>
     */
    protected $searchableColumns = [
        'name' => 'like',
        'description' => 'like',
        'price' => 'like',
        'is_active' => '=',
    ];
}
