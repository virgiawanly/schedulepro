<?php

namespace App\Models;

use App\Traits\AutoGenerateUuid;
use App\Traits\ScopedByCompanyAndLocation;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends BaseModel
{
    use HasFactory, SoftDeletes, ScopedByCompanyAndLocation, AutoGenerateUuid;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'customers';

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
        'phone',
        'email',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip_code',
        'is_active',
    ];

    /**
     * The attributes that are searchable in the query.
     *
     * @var array<int, string>
     */
    protected $searchables = [
        'name',
        'email',
        'phone',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip_code',
        'is_active',
    ];

    /**
     * The columns that are searchable in the query.
     *
     * @var array<string, string>
     */
    protected $searchableColumns = [
        'name' => 'like',
        'email' => 'like',
        'phone' => 'like',
        'address_line_1' => 'like',
        'address_line_2' => 'like',
        'city' => 'like',
        'state' => 'like',
        'zip_code' => 'like',
        'is_active' => '=',
    ];

    /**
     * The columns or expressions that will be sorted if the given parameter exists.
     *
     * @var array<string, string>
     */
    protected $sortColumns = [
        'full_address' => 'address_line_1',
        'uuid' => 'id',
    ];

    /**
     * The attributes that should be appended to the model.
     *
     * @var array
     */
    protected $appends = [
        'full_address',
    ];

    /**
     * Get full address attribute.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    public function fullAddress(): Attribute
    {
        return new Attribute(get: function () {
            $addresses = [
                $this->getAttributeValue('address_line_1'),
                $this->getAttributeValue('address_line_2'),
                $this->getAttributeValue('city'),
                $this->getAttributeValue('state'),
                $this->getAttributeValue('zip_code')
            ];

            return implode(', ', array_filter($addresses));
        });
    }
}
