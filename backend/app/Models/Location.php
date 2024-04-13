<?php

namespace App\Models;

use App\Traits\AutoGenerateUuid;
use App\Traits\ScopedByCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends BaseModel
{
    use HasFactory, SoftDeletes, ScopedByCompany, AutoGenerateUuid;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'locations';

    /**
     * The attributes that are searchable in the query.
     *
     * @var array<int, string>
     */
    protected $searchables = [
        'name',
        'email',
        'phone',
        'website',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'company_id',
        'name',
        'slug',
        'address',
        'phone',
        'email',
        'is_active',
    ];

    /**
     * Retrieves the company associated with this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
