<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class LocationScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $builder
     * @param  \Illuminate\Database\Eloquent\Model   $model
     * @return void
     */
    public function apply(Builder $builder, Model $model): void
    {
        $locationId = $model->location_id;
        if (auth()->check()) {
            $user = auth()->user();

            // If the user is admin, the user must select the location first
            if ($user->can_access_multiple_locations) {
                $locationId = request()->header('Location-Id');
            } elseif ($user->employee) {
                // If the user is employee, the employee must be assigned to the location first
                $locationId = $user->employee->location_id;
            }
        }

        $builder->where('location_id', $locationId);
    }
}
