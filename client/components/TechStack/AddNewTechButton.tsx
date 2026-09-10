import React from "react"; 
import { Plus } from "lucide-react"; 
 
interface AddNewTechProps {
  onClick?: () => void;
}

function AddNewTech({ onClick }: AddNewTechProps) { 
  return ( 
    <button 
      type="button" 
      onClick={onClick}
      className=" 
        group 
        inline-flex items-center gap-2 
        rounded-md 
        border border-zinc-200 
        bg-white 
        px-3 py-1.5 
        text-sm font-medium text-zinc-600 
        shadow-sm 
        transition-all duration-200 
        hover:border-zinc-300 
        hover:bg-zinc-50 
        hover:text-zinc-900 
        active:scale-[0.98] 
        dark:border-zinc-800 
        dark:bg-zinc-950 
        dark:text-zinc-400 
        dark:hover:border-zinc-700 
        dark:hover:bg-zinc-900 
        dark:hover:text-zinc-100 
      " 
    > 
      <Plus 
        className=" 
          h-4 w-4 
          transition-transform duration-200 
          group-hover:rotate-90 
        " 
      /> 
 
      <span>Add Tech</span> 
    </button> 
  ); 
} 
 
export default AddNewTech; 