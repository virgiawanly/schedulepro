<?php

namespace App\Models;

use App\Traits\AutoGenerateUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends BaseModel
{
    use HasFactory, SoftDeletes, AutoGenerateUuid;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'companies';

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
        'name',
        'slug',
        'email',
        'phone',
        'website',
        'logo',
        'is_active',
        'owner_id',
    ];

    /**
     * Retrieves the locations associated with this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function locations(): HasMany
    {
        return $this->hasMany(Location::class);
    }
}
