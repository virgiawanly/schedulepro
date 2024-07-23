<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Traits\AutoGenerateUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, AutoGenerateUuid;

    /**
     * The attributes that are searchable in the query.
     *
     * @var array<int, string>
     */
    protected $searchables = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'username',
        'gender',
        'birthdate',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'uuid',
        'first_name',
        'last_name',
        'username',
        'email',
        'phone',
        'email_verified_at',
        'password',
        'image',
        'role',
        'is_active',
        'last_login_at',
        'gender',
        'birthdate',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * The attributes that should be appended.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'full_name',
        'image_url',
        'can_access_multiple_locations',
    ];

    /**
     * Retrieves the company associated with this model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Check attribute that shows if user can access multiple locations
     *
     * @return bool
     */
    public function getCanAccessMultipleLocationsAttribute()
    {
        return $this->role === UserRole::ADMIN->value;
    }

    /**
     * Get full name attribute.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return $this->getAttributeValue('first_name') . ' ' . $this->getAttributeValue('last_name');
    }

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
