<?php

namespace App\Http\Controllers\Api\Web\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\BaseResourceController;
use App\Http\Requests\Web\V1\Admin\Material\CreateMaterialRequest;
use App\Http\Requests\Web\V1\Admin\Material\UpdateMaterialRequest;
use App\Repositories\MaterialRepository;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MaterialController extends BaseResourceController
{
    /**
     * Product repository instance.
     *
     * @var \App\Repositories\MaterialRepository
     */
    protected MaterialRepository $repository;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->repository = new MaterialRepository();

        parent::__construct($this->repository);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\Web\V1\Admin\Material\CreateMaterialRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateMaterialRequest $request)
    {
        try {
            $payload = $request->validated();
            $payload['company_id'] = auth()->user()->company_id;
            $payload['location_id'] = $request->header('Location-Id');

            if ($request->hasFile('image')) {
                $payload['image'] = $request->file('image')->store('materials');
            }

            $result = $this->service->save($payload);
            return ResponseHelper::success('Successfully created.', $result, 201);
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\Web\V1\Admin\Material\UpdateMaterialRequest  $request
     * @param  string  $uuid
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMaterialRequest $request, string $uuid)
    {
        try {
            $payload = $request->validated();

            if ($request->hasFile('image')) {
                $payload['image'] = $request->file('image')->store('materials');
            } else if ($request->has('is_image_removed') && $request->is_image_removed) {
                $payload['image'] = null;
            }

            $result = $this->service->patchByUuid($uuid, $payload);
            return ResponseHelper::success('Successfully updated.', $result, 200);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Resource not found.');
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }

    /**
     * Toggle the material status.
     *
     * @param  string  $uuid
     * @return \Illuminate\Http\Response
     */
    public function toggleStatus(string $uuid)
    {
        try {
            $material = $this->repository->findByUuid($uuid);
            $material->update(['is_active' => !$material->is_active]);

            return ResponseHelper::success('Successfully updated.', $material, 200);
        } catch (ModelNotFoundException $e) {
            return ResponseHelper::notFound('Resource not found.');
        } catch (Exception $e) {
            return ResponseHelper::internalServerError($e->getMessage(), $e);
        }
    }
}
