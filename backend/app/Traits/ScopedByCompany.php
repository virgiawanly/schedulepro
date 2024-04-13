<?php

namespace App\Traits;

use App\Models\Scopes\CompanyScope;

trait ScopedByCompany
{
    /**
     * Boot the scoped user company.
     */
    protected static function bootScopedByCompany(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    /**
     * Disable the company scope.
     */
    public static function withoutCompanyScope(): static
    {
        return (new static)->newQueryWithoutScope(new CompanyScope);
    }
}
