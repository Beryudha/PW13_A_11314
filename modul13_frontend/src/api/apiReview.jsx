import useAxios from ".";

// Mendapatkan semua review untuk ditaruh di halaman content
export const  GetAllReviews = async () => {
    try {
        const response = await useAxios.get("/reviews", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

// ngambil data review berdasarkan content yang diklik
export const GetContentReviews = async (id) => {
    try {
        const response = await useAxios.get(`/reviews/contents/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Membuat review baru
export const CreateReview = async (data) => {
    try {
        const response = await useAxios.post("/reviews", data, {
            headers: {
                "Content-Type": "multipart/form-data", // untuk upload thumbnail
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Mengedit review
export const UpdateReview = async (values) => {
    try {
        const response = await useAxios.put(`/reviews/${values.id}`, values, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Menghapus review
export const DeleteReview = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const response = await useAxios.delete(`/reviews/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};