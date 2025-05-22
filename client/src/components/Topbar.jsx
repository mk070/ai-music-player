import React from 'react'
import { Search, Bell } from 'lucide-react'

const Topbar = ({ toggleSidebar }) => {
  return (
<div className="flex justify-between items-center px-8 py-4 sticky top-0 z-10 bg-[#07070d]/90 backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-[#fcfcff]">Home</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c4c4c4]/50" size={18} />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="bg-[#3a3a43]/30 border border-[#3a3a43]/50 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-[#3c3abe]/50 text-sm"
                />
              </div>
              <button className="relative w-10 h-10 flex items-center justify-center">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#3c3abe] rounded-full"></span>
              </button>
            </div>
          </div>
            )
}

export default Topbar