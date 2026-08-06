import {
  FaCode,
  FaReact,
  FaNodeJs,
  FaMobileAlt,
  FaCloud,
  FaDatabase,
  FaRobot,
  FaComments,
  FaSearch,
  FaShoppingCart,
  FaWordpress,
  FaServer,
  FaBrain,
  FaCogs,
  FaLaptopCode,
  FaShieldAlt,
  FaPython,
} from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiMongodb } from "react-icons/si";
import { MdDesignServices, MdAutoAwesome } from "react-icons/md";
import { TbApi } from "react-icons/tb";
import { HiOutlineSparkles } from "react-icons/hi";

export const SERVICE_ICON_OPTIONS = [
  { value: "code", label: "General / Code", Icon: FaCode },
  { value: "fullstack", label: "Full-Stack", Icon: FaLaptopCode },
  { value: "react", label: "React / Frontend", Icon: FaReact },
  { value: "nextjs", label: "Next.js", Icon: SiNextdotjs },
  { value: "nodejs", label: "Node.js / Backend", Icon: FaNodeJs },
  { value: "typescript", label: "TypeScript", Icon: SiTypescript },
  { value: "python", label: "Python", Icon: FaPython },
  { value: "api", label: "API Development", Icon: TbApi },
  { value: "mobile", label: "Mobile Apps", Icon: FaMobileAlt },
  { value: "uiux", label: "UI / UX Design", Icon: MdDesignServices },
  { value: "cloud", label: "Cloud", Icon: FaCloud },
  { value: "devops", label: "DevOps / Server", Icon: FaServer },
  { value: "database", label: "Database", Icon: FaDatabase },
  { value: "mongodb", label: "MongoDB", Icon: SiMongodb },
  { value: "ecommerce", label: "E-commerce", Icon: FaShoppingCart },
  { value: "wordpress", label: "WordPress", Icon: FaWordpress },
  { value: "security", label: "Security", Icon: FaShieldAlt },
  { value: "ai", label: "AI Solutions", Icon: FaBrain },
  { value: "rag", label: "RAG / Knowledge AI", Icon: HiOutlineSparkles },
  { value: "chatbot", label: "AI Chatbot", Icon: FaComments },
  { value: "llm", label: "LLM Apps", Icon: MdAutoAwesome },
  { value: "langchain", label: "Agents / LangChain", Icon: FaCogs },
  { value: "ml", label: "Machine Learning", Icon: FaRobot },
  { value: "automation", label: "Automation", Icon: FaCogs },
  { value: "search", label: "Semantic Search", Icon: FaSearch },
  { value: "generative", label: "Generative AI", Icon: MdAutoAwesome },
];

export const getServiceIcon = (value = "code") => {
  const match = SERVICE_ICON_OPTIONS.find(
    (item) => item.value === String(value || "").toLowerCase()
  );
  return match?.Icon || FaCode;
};
