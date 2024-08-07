<?php

namespace App\Models;

use App\Traits\AutoGenerateUuid;
use App\Traits\ScopedByCompanyAndLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Material extends BaseModel
{
    use HasFactory, SoftDeletes, ScopedByCompanyAndLocation, AutoGenerateUuid;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'materials';

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
        'uom',
        'price',
        'image',
        'is_active',
    ];

    /**
     * The attributes that should be appended.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * The attributes that are searchable in the query.
     *
     * @var array<int, string>
     */
    protected $searchables = [
        'name',
        'description',
        'uom',
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
        'uom' => 'like',
        'price' => 'like',
        'is_active' => '=',
    ];

    /**
     * Get image url attribute.
     *
     * @return string
     */
    public function getImageUrlAttribute()
    {
        return $this->image ? Storage::url($this->image) : null;
    }
}
