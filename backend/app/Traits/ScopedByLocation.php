<?php

namespace App\Traits;

use App\Models\Scopes\LocationScope;

trait ScopedByLocation
{
    /**
     * Boot the scoped user location.
     */
    protected static function bootScopedByLocation(): void
    {
        static::addGlobalScope(new LocationScope);
    }

    /**
     * Disable the location scope.
     */
    public static function withoutLocationScope()
    {
        return (new static)->newQueryWithoutScope(new LocationScope);
    }
}
