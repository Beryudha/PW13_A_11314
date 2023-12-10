import { Container, Stack, Button, Spinner, Alert, Form, Row, Col} from "react-bootstrap";
import kucheng from '../assets/images/cat.jpg';

// import { useMutation } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { IoPersonCircle } from "react-icons/io5";

import { toast } from "react-toastify";

import { GetContentReviews, DeleteReview, CreateReview} from "../api/apiReview";
import { useEffect, useState } from "react";
import { getThumbnail } from "../api";
import InputForm from "../components/forms/InputFloatingForm";

import { useLocation } from 'react-router-dom';

const ReviewPage = () => {
    // dapetin data content hasil passing dari Dashboard
    const { state: { content } } = useLocation();

    const [isLoading, setIsLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isPending, setIsPending] = useState(false);

    //ngubah data user dari storage, 
    //nanti buat error handling yang ga boleh komen content sendiri (baris 50)
    //sama buat nyimpen data id_user table review (baris 57)
    const userData = sessionStorage.getItem("user");
    const user = JSON.parse(userData);
    const id_user = user.id;

    const [data, setData] = useState({
        id_user: "",
        id_content: "",
        comment: "",
    });
    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const submitData = (event) => {
        event.preventDefault();
        setIsPending(true);

        if (data.comment === "") {
            toast.error("Review must be filled.");
            setIsPending(false);
            return;
        }else 
        if(content.id_user === id_user){
            toast.error("You are not allowed to review your own content");
            setIsPending(false);
            return;
        }else{
            
            const formData = new FormData();
            formData.append("id_user", id_user);
            formData.append("id_content", content.id);
            formData.append("comment", data.comment);

            CreateReview(formData)
                .then((response) => {
                    setIsPending(false);
                    toast.success(response.message);
                    fetchReviews();
                })
                .catch((err) => {
                    console.log(err);
                    setIsPending(false);
                    toast.dark(JSON.stringify(err.message));
                });
        }
    };
    
    // hapus review
    const deleteReview = (id) => {
        setIsPending(true);
        DeleteReview(id).then((response) => {
            setIsPending(false);
            toast.success(response.message);
            fetchReviews();
        }).catch((err) => {
            console.log(err);
            setIsPending(false);
            toast.dark(err.message);
        })
    }

    //ambil review
    const fetchReviews = () => {
        setIsLoading(true);
        GetContentReviews(content.id).then((response) => {
            setReviews(response);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        fetchReviews();
    }, [])

    return (
        <>
            <Container className="mt-4">
                <Stack direction="horizontal" gap={3} className="mb-3">
                    <h1 className="h4 fw-bold mb-0 text-nowrap">Review Video</h1>
                    <hr className="border-top border-light opacity-50 w-100" />
                </Stack>
                
                <div
                    className="card text-white"
                    style={{ aspectRatio: "16 / 9" }}
                >
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card-body">
                                <img
                                    src={getThumbnail(content.thumbnail)}
                                    className="card-img w-100 h-100 object-fit-cover bg-light"
                                    alt="..."
                                />
                            </div>
                        </div>
                    
                        <div className="col-md-4">
                            <div className="card-body">
                                <HiMiniVideoCamera style={{ fontSize: '4rem'}}/>
                                <h1 className="card-title text-truncate">
                                    {content.title}
                                </h1>
                                <p className="card-text">{content.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <hr />
                    <h3>Reviews</h3>
                    <p>Tuliskan review baru:</p>
                    <Form onSubmit={submitData}>
                        <div className="row">
                            <div className="col-md-11">
                                <InputForm
                                    label="Add New Review"
                                    placeholder="Add New Review"
                                    name="comment"
                                    type="text"
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="col-md-1 mt-2">
                                <Button variant="primary" type="submit" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            Loading...
                                        </>
                                    ) : (
                                        <span>Kirim</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Form>
                    
                </div>
                {isLoading ? (
                    <div className="text-center">
                        <Spinner
                            as="span"
                            animation="border"
                            variant="primary"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                ) : (reviews?.length > 0 ? (
                    <Row>
                        {reviews?.map((review) => (
                            <Col md={6} lg={12} className="mb-3" key={review.id}>
                                <div className="card text-white mt-2" style={{ background: "none"}}>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="card-body">
                                                <img src={kucheng} className="img-fluid rounded-circle mt-2" alt="Tidak Ada Gambar" style={{ width: '150px', height: '150px' }}/>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-9">
                                            <div className="card-body mt-5">
                                                <h4>{user.handle}</h4>
                                                <p>{review.comment}</p>
                                            </div>
                                        </div>

                                        {review.id_user === user.id 
                                            ? 
                                            <div className="col-md-1">
                                                <div className="card-body mt-5">
                                                    <Button variant="danger" onClick={() => deleteReview(review.id)}>
                                                        <FaTrash/>
                                                    </Button>
                                                </div>
                                            </div>

                                            :
                                            ""
                                        }
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Alert variant="dark" className="mt-3 text-center">
                        Belum ada review, ayo tambahin review!
                    </Alert>
                ))}
            </Container>
        </>
    );
};

export default ReviewPage;
