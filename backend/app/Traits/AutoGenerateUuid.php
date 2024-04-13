<?php

namespace App\Traits;

use Ramsey\Uuid\Uuid;

trait AutoGenerateUuid
{
    /**
     * Boot the auto generate uuid trait for a model.
     */
    public static function bootAutoGenerateUuid(): void
    {
        static::creating(function ($model) {
            $columnName = $model->uuidColumn ?? 'uuid';

            if (!$model->$columnName) {
                $model->$columnName = Uuid::uuid4()->toString();
            }
        });
    }
}
