import {
  CirclePlus,
  Coins,
  LogOut,
  MessageCirclePlus,
  MessageSquare,
  PanelLeftIcon,
  PanelRightIcon,
  PenBoxIcon,
  Plus,
  User,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getConversations } from "../features/getConversations";
import { createConversation } from "../features/createConversation";

import {
  setConversations,
  setSelectConversation,
} from "../redux/conversationSlice";

import { logout } from "../features/logout";
import { setUserData } from "../redux/userSlice";
import { setArtifacts, setMessages } from "../redux/MessageSlice";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);

  const dispatch = useDispatch();

  const conversationState = useSelector((state) => state.conversation);
  const userData = useSelector((state) => state.user?.userData);

  const conversations = Array.isArray(conversationState?.conversations)
    ? conversationState.conversations
    : [];

  const selectedConversation = conversationState?.selectedConversation;

  useEffect(() => {
    setImageError(false);
  }, [userData?.avatar]);

  useEffect(() => {
    let cancelled = false;

    const fetchConversations = async () => {
      try {
        const data = await getConversations();

        if (!cancelled && Array.isArray(data)) {
          dispatch(setConversations(data));
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();

    return () => {
      cancelled = true;
    };
  }, [dispatch, userData?._id]);

const handleCreateConversation = async () => {
  if (creatingConversation) return;

  setCreatingConversation(true);

  try {
    const response = await createConversation();

    dispatch(setConversations([response, ...conversations]));
    dispatch(setSelectConversation(response));
  } catch (error) {
    console.error("Failed to create conversation:", error);
  } finally {
    setCreatingConversation(false);
  }
};

  const handleLogout = () => {
    logout();
    dispatch(setUserData(null));
  };
  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0 ">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0 mb-1"
        >
          <PanelRightIcon size={20} />
        </button>
        <button 
        onClick={()=>dispatch(setSelectConversation(null))}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0">
          <MessageCirclePlus size={18} />
        </button>
        <div className="flex-1 min-h-0 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-3">
          {conversations.map((conv) => {
            const conversationId = conv?._id ?? conv?.id;
            const selectedId =
              selectedConversation?._id ?? selectedConversation?.id;

            const isActive =
              conversationId != null &&
              selectedId != null &&
              String(conversationId) === String(selectedId);

            return (
              <button
                type="button"
                key={conversationId}
                onClick={() => dispatch(setSelectConversation(conv))}
                className={`w-full text-left flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 hover:bg-white/[0.05] ${
                  isActive
                    ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                    : "bg-transparent border-transparent"
                }`}
              >
                <span
                  className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "bg-white/[0.05] text-slate-500"
                  }`}
                >
                  <MessageSquare size={18} />
                </span>

                
              </button>
            );
          })}

        </div>
        <div>
           {userData?.avatar && !imageError ? (
                <img
                  src={userData.avatar}
                  alt={userData.name || "User"}
                  onError={() => setImageError(true)}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                  <User size={15} className="text-slate-400" />
                </div>
              )}
        </div>
      </div>
    );
  }
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 ${
        collapsed ? "w-[70px]" : "w-[280px]"
      } h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06] transition-[width] duration-200`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className={`flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06] ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
          >
            <PanelLeftIcon size={18} />
          </button>

          {!collapsed && (
            <>
              <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
                Cortex AI
              </span>

              <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5 tracking-wide">
                Free
              </span>

              <button
                type="button"
                aria-label="Create new chat"
                         onClick={()=>{
                    dispatch(setSelectConversation(null))
                    dispatch(setMessages([]))
                    dispatch(setArtifacts([]))

                   }}

                disabled={creatingConversation}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
              >
                <PenBoxIcon size={20} />
              </button>
            </>
          )}
        </div>

        {/* New Chat */}
        <div className="px-4 pt-4 pb-1">
          <button
            type="button"
                   onClick={()=>{
                    dispatch(setSelectConversation(null))
                    dispatch(setMessages([]))
                    dispatch(setArtifacts([]))

                   }}

            disabled={creatingConversation}
            title={collapsed ? "New chat" : undefined}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150 disabled:opacity-60"
          >
            <Plus size={15} />
            {!collapsed && (
              <span>{creatingConversation ? "Creating..." : "New Chat"}</span>
            )}
          </button>
        </div>

        {/* Conversations */}
        {!collapsed && (
          <>
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              {conversations.length === 0
                ? "No Recent Conversations"
                : "Recent Conversations"}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {conversations.map((conv,index) => {
                const conversationId = conv?._id ?? conv?.id;
                const selectedId =
                  selectedConversation?._id ?? selectedConversation?.id;

                const isActive =
                  conversationId != null &&
                  selectedId != null &&
                  String(conversationId) === String(selectedId);

                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => dispatch(setSelectConversation(conv))}
                    className={`w-full text-left flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 hover:bg-white/[0.05] ${
                      isActive
                        ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                        : "bg-transparent border-transparent"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${
                        isActive
                          ? "bg-indigo-500/15 text-indigo-400"
                          : "bg-white/[0.05] text-slate-500"
                      }`}
                    >
                      <MessageSquare size={13} />
                    </span>

                    <span
                      className={`block min-w-0 flex-1 text-[13px] font-medium truncate ${
                        isActive ? "text-slate-100" : "text-slate-300"
                      }`}
                    >
                      {conv?.title || "New Chat"}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mx-2.5 h-px bg-white/[0.06] shrink-0" />

        {/* User Profile */}
        <div className="px-3.5 py-3.5 mt-auto">
          {userData ? (
            <div
              title={collapsed ? userData.name || "Account" : undefined}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-white/[0.05] transition-colors duration-150 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              {userData?.avatar && !imageError ? (
                <img
                  src={userData.avatar}
                  alt={userData.name || "User"}
                  onError={() => setImageError(true)}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                  <User size={15} className="text-slate-400" />
                </div>
              )}

              {!collapsed && (
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="min-w-0 flex-1 text-sm font-medium text-slate-200 truncate">
                      {userData.name || "User"}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label="Upgrade plan"
                        title="Upgrade plan"
                        className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.05] hover:text-yellow-400 transition-all duration-150"
                      >
                        <Coins size={16} />
                      </button>

                      <button
                        type="button"
                        aria-label="Log out"
                        title="Log out"
                        onClick={handleLogout}
                        className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.05] hover:text-slate-300 transition-all duration-150"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 truncate">
                    {userData.email || ""}
                  </span>

                  <span className="text-xs text-slate-500 truncate">
                    Free Plan
                  </span>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.location.href = "/login";
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] transition-colors duration-150 cursor-pointer"
            >
              <User size={16} />
              {!collapsed && "Login"}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
