import { signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/Chatarea";
import Artifact from "../components/Artifact";

const Home = () => {
    const {userData} = useSelector(state => state.user);
    const dispatch = useDispatch();
    
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/api/auth/login", { token });
      dispatch(setUserData(data.user))
      
    } catch (error) {
      console.log(error);
    }
  };
  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    
    await handleLogin(token);
   
  };
  return (
    <div className="h-screen  flex bg-[#0d0f14] text-white overflow-hidden">


    <Sidebar></Sidebar>
    <ChatArea></ChatArea>
    <Artifact></Artifact>










      {
        !userData && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm ">
        <div className="w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
              Welcome to CortexAI
            </h2>
            <p className="text-[13px] text-slate-400">
              Please login to continue
            </p>
          </div>
          <button onClick={googleLogin} className="group w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-medium shadow-sm hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
            <FcGoogle size={15} className="text-white" />
            
            Continue with Google
          </button>
        </div>
      </div>)
      }
    </div>
  );
};

export default Home;
