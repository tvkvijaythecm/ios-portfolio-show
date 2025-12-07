import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

const AdminHeader = ({ title, description }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 mb-6"
    >
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mt-1 p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {description && <p className="text-white/60 mt-1">{description}</p>}
      </div>
    </motion.div>
  );
};

export default AdminHeader;