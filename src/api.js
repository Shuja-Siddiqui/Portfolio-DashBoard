import axios from "axios";
const token = localStorage.getItem("@token");
export const baseURL = process.env.REACT_APP_PUBLIC_URL;
export const loginRequest = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, data);
    localStorage.setItem("@token", response?.data?.data?.token);
    localStorage.setItem("@id", response?.data?.data?.userExist?.username);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const createDeveloper = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/developer`, data);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const updateDeveloper = async (data, id) => {
  try {
    const response = await axios.put(`${baseURL}/developer/${id}`, data);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const addSkill = async (skillName) => {
  try {
    const response = await axios.post(`${baseURL}/skill`, skillName);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchSkills = async () => {
  try {
    const response = await axios.get(`${baseURL}/skill/all/skills`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchAvatar = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/file/${id}`);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const createImageId = async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.post(`${baseURL}/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.log("Error occurred", error);
    throw error;
  }
};
export const createImageIds = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files${index}`, file);
    });

    const response = await axios.post(`${baseURL}/file/multiple`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.log("Error occurred", error);
    throw error;
  }
};

export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${baseURL}/project/all/projects`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchProject = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/project/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const createProject = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/project`, data);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const updateProject = async (data, id) => {
  try {
    const response = await axios.put(`${baseURL}/project/${id}`, data);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const addTestimonials = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/testimonial`, data);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchTestimonials = async () => {
  try {
    const response = await axios.get(`${baseURL}/testimonial/all/testimonial`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchTestimonial = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/testimonial/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const updateTestimonial = async (id, data) => {
  try {
    const response = await axios.put(`${baseURL}/testimonial/${id}`, data);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const addservice = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/service`, data);
    return response;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchService = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/service/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const updateService = async (id, data) => {
  try {
    const response = await axios.put(`${baseURL}/service/${id}`, data);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchservices = async () => {
  try {
    const response = await axios.get(`${baseURL}/service/all/service`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};

// OLD APIS

export const editServiceRequest = async (data) => {
  const name = data?.name;
  const description = data?.description;

  try {
    const response = await axios.put(
      `${baseURL}/service/${data?._id}`,
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
    console.log("Error occurred", error?.message);
  }
};

export const deleteServiceRequest = async (serviceId) => {
  try {
    const response = await axios.delete(`${baseURL}/service/${serviceId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const createProjectRequest = async (data) => {
  try {
    const response = await axios.post(
      `${baseURL}/project/6450cb8a8eb415ba6bd72ae9`,
      data,
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

export const editProjectImageRequest = async (id, data) => {
  try {
    const response = await axios.patch(`${baseURL}/project/file/${id}`, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const editProjectRequest = async (data) => {
  const project_name = data?.project_name;
  const description = data?.description;
  const link = data?.link;

  try {
    const response = await axios.patch(
      `${baseURL}/project/${data?._id}`,
      {
        project_name,
        description,
        link,
        // image,
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
    const response = await axios.delete(`${baseURL}/project/${projectId}`, {
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
      `${baseURL}/testimonial/6450cb8a8eb415ba6bd72ae9`
    );
    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const createTestimonialRequest = async (data) => {
  try {
    const response = await axios.post(
      `${baseURL}/testimonial/6450cb8a8eb415ba6bd72ae9`,
      data,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log("Error occurred", error);
  }
};

export const getDevelopers = async () => {
  try {
    const response = await axios.get(`${baseURL}/developer/all/developers`, {});
    return response?.data?.data;
  } catch (error) {
    console.log("Error occurred", error);
    throw error;
  }
};
export const getDeveloper = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/developer/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occurred", error);
    throw error;
  }
};

export const editTestimonialTextRequest = async (id, data) => {
  try {
    const response = await axios.patch(`${baseURL}/testimonial/${id}`, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const editTestimonialImageRequest = async (id, data) => {
  try {
    const response = await axios.patch(
      `${baseURL}/testimonial/file/${id}`,
      data,
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
    const response = await axios.delete(`${baseURL}/testimonial/${t_id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};

export const getImageRequest = (i_id) => {
  return `${baseURL}/file/${i_id}`;
};

export const updateUserRequest = (data) => {
  try {
    const response = axios.patch(
      `${baseURL}/user_info/6450cb8a8eb415ba6bd72ae9`,
      data,
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

export const updateContactEmailRequest = async (data) => {
  try {
    const response = await axios.patch(`${baseURL}/settings`, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log("Error occurred", error?.message);
  }
};
