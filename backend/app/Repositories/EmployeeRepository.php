<?php

namespace App\Repositories;

use App\Models\Employee;
use App\Repositories\Interfaces\BaseResourceRepositoryInterface;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class EmployeeRepository extends BaseResourceRepository implements BaseResourceRepositoryInterface, EmployeeRepositoryInterface
{
    /**
     * Create a new instance of the repository.
     *
     * @return void
     */
    public function __construct()
    {
        $this->model = new Employee();
    }

    /**
     * Get all resources.
     *
     * @param  array $queryParams
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function list(array $queryParams = []): Collection
    {
        $search = $queryParams['search'] ?? '';
        $sortBy = $queryParams['sort'] ?? '';
        $order = $queryParams['order'] ?? 'asc';
        $sortOrder = (str_contains($order, 'asc') ? 'asc' : 'desc') ?? '';

        return $this->model
            ->select('employees.*')
            ->leftJoin('users', 'users.id', '=', 'employees.user_id')
            ->search($search)
            ->searchColumns($queryParams)
            ->ofOrder($sortBy, $sortOrder)
            ->get();
    }

    /**
     * Get all resources with pagination.
     *
     * @param int $perPage
     * @param array $queryParams
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginatedList(int $perPage, array $queryParams = []): LengthAwarePaginator
    {
        $search = $queryParams['search'] ?? '';
        $sortBy = $queryParams['sort'] ?? '';
        $order = $queryParams['order'] ?? 'asc';
        $sortOrder = (str_contains($order, 'asc') ? 'asc' : 'desc') ?? '';

        return $this->model
            ->select('employees.*')
            ->leftJoin('users', 'users.id', '=', 'employees.user_id')
            ->search($search)
            ->searchColumns($queryParams)
            ->ofOrder($sortBy, $sortOrder)
            ->paginate($perPage);
    }

    /**
     * Get a resource by id.
     *
     * @param  int|string $id
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find(int|string $id): Model
    {
        return $this->model->with('user')->findOrFail($id);
    }

    /**
     * Get a resource by uuid.
     *
     * @param  string $uuid
     */
    public function findByUuid(string $uuid): Model
    {
        return $this->model->with('user')->where('uuid', $uuid)->firstOrFail();
    }
}
