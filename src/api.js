import axios from "axios";
const token = localStorage.getItem("@token");
// export const baseURL = "https://portfolio-api-zeta-seven.vercel.app/api/v1";
export const baseURL = process.env.REACT_APP_URL;
export const loginRequest = async (data) => {
  try {
    console.log(baseURL);
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
export const fetchAllDevelopers = async () => {
  try {
    const response = await axios.get(`${baseURL}/developer/all/developers`);
    return response?.data;
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
export const addService = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/service`, data);
    return response?.data;
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
export const fetchServices = async () => {
  try {
    const response = await axios.get(`${baseURL}/service/all/service`);
    return response?.data?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const addEducation = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/education`, data);
    return response?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchEducation = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/education/${id}`);
    return response?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const updateEducation = async (id, data) => {
  try {
    const response = await axios.put(`${baseURL}/education/${id}`, data);
    return response?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchEducations = async () => {
  try {
    const response = await axios.get(`${baseURL}/education/all/education`);
    return response?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const addExperience = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/experience`, data);
    return response?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchExperience = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/experience/${id}`);
    return response?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const updateExperience = async (id, data) => {
  try {
    const response = await axios.put(`${baseURL}/experience/${id}`, data);
    return response?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
  }
};
export const fetchExperiences = async () => {
  try {
    const response = await axios.get(`${baseURL}/experience/all/experience`);
    return response?.data;
  } catch (error) {
    console.log("Error occured", error?.message);
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

// OLD APIS
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
