import axios from "axios";
const BASE_URL = "http://localhost:5000";
const token = localStorage.getItem("token");
const uid = localStorage.getItem("user_id");

export const loginRequest = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, data);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};

export const createServiceRequest = async (data) => {
  const name = data?.name;
  const description = data?.description;

  try {
    const response = await axios.post(
      `${BASE_URL}/service/6450cb8a8eb415ba6bd72ae9`,
      {
        name,
        description,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};

export const updateDeveloperInfoRequest = async (data) => {
  console.log("data for update inside API is", data);

  try {
    const response = await axios.put(
      `${BASE_URL}/developer_info/6450cb8a8eb415ba6bd72ae9`,
      data,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};

export const createProjectRequest = async (data) => {
  const project_name = data?.project_name;
  const description = data?.description;
  const link = data?.link;
  const image = data?.image;

  try {
    const response = await axios.post(
      `${BASE_URL}/project/6450cb8a8eb415ba6bd72ae9`,
      {
        project_name,
        description,
        link,
        image,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const deleteProjectRequest = async (projectId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/project/${projectId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const getTestimonialRequest = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/testimonial/6450cb8a8eb415ba6bd72ae9`
    );
    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const createTestimonialRequest = async (data) => {
  const client_name = data.client_name;
  const review = data.review;
  const stars = data.stars;
  const field = data.field;
  const image = data.image;

  try {
    const response = await axios.post(
      `${BASE_URL}/testimonial/6450cb8a8eb415ba6bd72ae9`,
      {
        client_name,
        review,
        stars,
        field,
        image,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const deleteTestimonialRequest = async (t_id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/testimonial/${t_id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};