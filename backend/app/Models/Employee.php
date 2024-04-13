<?php

namespace App\Models;

use App\Traits\AutoGenerateUuid;
use App\Traits\ScopedByCompanyAndLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends BaseModel
{
    use HasFactory, SoftDeletes, ScopedByCompanyAndLocation, AutoGenerateUuid;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'employees';

    /**
     * The relations to eager load on every query.
     *
     * @var array<int, string>
     */
    protected $with = [
        'user',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'employee_number',
        'user_id',
        'company_id',
        'location_id',
        'join_date',
    ];

    /**
     * Retrieves the user account associated with this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
