<?php

namespace App\Repositories\Interfaces;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface BaseResourceRepositoryInterface
{
    /**
     * Get all resources.
     *
     * @param  array $queryParams
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function list(array $queryParams = []): Collection;

    /**
     * Get all resources with pagination.
     *
     * @param int $perPage
     * @param array $queryParams
     */
    public function paginatedList(int $perPage, array $queryParams = []): LengthAwarePaginator;

    /**
     * Get a resource by id.
     *
     * @param int|string $id
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find(int|string $id): Model;

    /**
     * Get a resource by uuid.
     *
     * @param string $uuid
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function findByUuid(string $uuid): Model;

    /**
     * Create a new resource.
     *
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function save(array $data): Model;

    /**
     * Update a resource.
     *
     * @param int|string $id
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function update(int|string $id, array $data): Model;

    /**
     * Update a resource.
     *
     * @param string $id
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function updateByUuid(string $uuid, array $data): Model;

    /**
     * Delete a resource.
     *
     * @param int|string $id
     * @return bool
     */
    public function delete(int|string $id): bool;

    /**
     * Delete a resource by uuid.
     *
     * @param string $uuid
     * @return bool
     */
    public function deleteByUuid(string $uuid): bool;
}
