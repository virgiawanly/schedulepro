<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Repositories\BaseResourceRepository;
use App\Services\BaseResourceService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class BaseResourceController extends Controller
{
    /**
     * The base resource service.
     *
     * @var \App\Services\BaseResourceService
     */
    protected BaseResourceService $service;

    /**
     * Create a new controller instance.
     *
     * @param  \App\Repositories\BaseResourceRepository  $repository
     * @return void
     */
    public function __construct(BaseResourceRepository $repository)
    {
        $this->service = new BaseResourceService($repository);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Set default result as paginated list
            $result = $request->has('paginate') && ($request->paginate === 'false' || $request->paginate === '0')
                ? $this->service->list($request->all())
                : $this->service->paginatedList($request->all());

            return ResponseHelper::data($result);
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function save(Request $request)
    {
        try {
            $result = $this->service->save($request->all());
            return ResponseHelper::success('Successfully created.', $result, 201);
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $uuid)
    {
        try {
            $result = $this->service->findByUuid($uuid);
            return ResponseHelper::data($result);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Resource not found.');
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function patch(Request $request, string $uuid)
    {
        try {
            $result = $this->service->patchByUuid($uuid, $request->all());
            return ResponseHelper::success('Successfully updated.', $result);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Resource not found.');
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $uuid)
    {
        try {
            $this->service->deleteByUuid($uuid);
            return ResponseHelper::success('Successfully deleted.');
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Resource not found.');
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }
}
