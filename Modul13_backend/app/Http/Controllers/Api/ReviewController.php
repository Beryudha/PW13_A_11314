<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Contents;
use App\Models\User;
use App\Models\Reviews;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Reviews::inRandomOrder()->get();

        return response([
            'message' => 'All Reviews Retrieved',
            'data' => $reviews
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function showReviewbyContent($id) {
        $contents = Contents::find($id);
        if(!$contents){
            return response([
                'message' => 'Content Not Found',
                'data' => null
            ],404);
        }
        $reviews = Reviews::where('id_content', $contents->id)->get();
        return response([
            'message' => 'Reviews of '.$contents->title.' Retrieved',
            'data' => $reviews
        ],200);

    }

    public function store(Request $request)
    {
        $storeData = $request->all();

        $validate = Validator::make($storeData,[
            'comment' => 'required',
        ]);
        if ($validate->fails()) {
            return response(['message'=> $validate->errors()],400);
        }
        $idUser = Auth::user()->id;
        $user = User::find($idUser);
        if(is_null($user)){
            return response([
                'message' => 'User Not Found'
            ],404);
        }

        
        // $content = Contents::find($idContent);
        // if(is_null($content)){
        //     return response([
        //         'message' => 'Content Not Found'
        //     ],404);
        // }

        $storeData['id_user'] = $user->id;
        // $storeData['id_content'] = $content->id;

        $reviews = Reviews::create($storeData);
        return response([
            'message' => 'Review Added',
            'data' => $reviews,
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reviews = Reviews::find($id);

        if($reviews){
            return response([
                'message' => 'Review Found',
                'data' => $reviews
            ],200);
        }

        return response([
            'message' => 'Review Not Found',
            'data' => null
        ],404);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $review = Reviews::find($id);
        if(is_null($review)){
            return response([
                'message' => 'Review Not Found',
                'data' => null
            ],404);
        }

        $updateData = $request->all();

        $validate = Validator::make($updateData,[
            'comment' => 'required',
        ]);
        if ($validate->fails()) {
            return response(['message'=> $validate->errors()],400);
        }
        $idUser = Auth::user()->id;
        $user = User::find($idUser);
        if(is_null($user)){
            return response([
                'message' => 'User Not Found'
            ],404);
        }

        $review->update($updateData);

        return response([
            'message' => 'Review Updated Successfully',
            'data' => $review,
        ],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $reviews = Reviews::find($id);

        if(is_null($reviews)){
            return response([
                'message' => 'Review Not Found',
                'data' => null
            ],404);
        }

        if($reviews->delete()){
            return response([
                'message' => 'Review Deleted',
                'data' => $reviews,
            ],200);
        }

        return response([
            'message' => 'Delete Review Failed',
            'data' => null,
        ],400);
    }

}
