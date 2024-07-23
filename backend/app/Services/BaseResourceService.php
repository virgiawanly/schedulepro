<?php

namespace App\Services;

use App\Repositories\Interfaces\BaseResourceRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class BaseResourceService
{
    /**
     * Base resource repository.
     *
     * @var BaseResourceRepositoryInterface
     */
    protected BaseResourceRepositoryInterface $repository;

    /**
     * Default pagination size.
     *
     * @var int
     */
    protected $defaultPageSize = 10;

    /**
     * Create a new controller instance.
     *
     * @param BaseResourceRepositoryInterface $repository
     */
    public function __construct(BaseResourceRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Get all resources.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function list(array $queryParams): Collection
    {
        return $this->repository->list($queryParams);
    }

    /**
     * Get paginated resources.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginatedList(array $queryParams): LengthAwarePaginator
    {
        $size = $queryParams['size'] ?? $this->defaultPageSize;

        return $this->repository->paginatedList($size, $queryParams);
    }

    /**
     * Get a resource by id.
     *
     * @param int|string $id
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find(int|string $id): Model
    {
        return $this->repository->find($id);
    }

    /**
     * Get a resource by uuid.
     *
     * @param string $uuid
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function findByUuid(string $uuid): Model
    {
        return $this->repository->findByUuid($uuid);
    }

    /**
     * Create a new resource.
     *
     * @param array $payload
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function save(array $payload): Model
    {
        return $this->repository->save($payload);
    }

    /**
     * Update a resource.
     *
     * @param int|string $id
     * @param array $payload
     */
    public function patch(int|string $id, array $payload): Model
    {
        return $this->repository->update($id, $payload);
    }

    /**
     * Update a resource by uuid.
     *
     * @param string $uuid
     * @param array $payload
     */
    public function patchByUuid(string $uuid, array $payload): Model
    {
        return $this->repository->updateByUuid($uuid, $payload);
    }

    /**
     * Delete a resource.
     *
     * @param int|string $id
     * @return bool
     */
    public function delete(int|string $id): bool
    {
        return $this->repository->delete($id);
    }

    /**
     * Delete a resource by uuid.
     */
    public function deleteByUuid(string $uuid): bool
    {
        return $this->repository->deleteByUuid($uuid);
    }
}
