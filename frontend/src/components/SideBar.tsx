import React, { createContext, useContext, useState } from 'react'
import { MdMoreVert, MdOutlineDehaze, MdClose } from 'react-icons/md'; // Material Design
import { useNavigate } from 'react-router-dom';


interface SideBarProps {
  children?: React.ReactNode;
};

interface ItemProps {
  icon: React.ReactNode;
  text: string;
  link: string;
  active?: boolean;
  alert?: boolean;
};

const SideBarContext = createContext<any>({})

export default function SideBar({ children }: SideBarProps): React.ReactNode {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-tourney-navy1 border-r shadow-sm border-tourney-navy2">
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>
            TAS-32
          </span>
          <button onClick={() => setExpanded((curr) => !curr)} className='bg-tourney-navy2 p-1.5 rounded-lg hover:bg-tourney-orange'>
            {expanded ? <MdClose size={20} /> : <MdOutlineDehaze size={20} />}
          </button>
        </div>
        <SideBarContext.Provider value={{ expanded }}>
          <ul className='flex-1 px-3'>
            {children}
          </ul>
        </SideBarContext.Provider>
        <div className='flex border-t p-3 border-tourney-navy2'>
          <img
            //TODO: Change src to player avatar or default image
            src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            alt=''
            className='w-10 h-10 rounded-md'
          />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className='leading-4'>
              <h4 className='font-semibold'>Whoami</h4>
              <span className='text-xs text-gray-50'>random@email.com</span>
            </div>
            <MdMoreVert size={20} />
          </div>
        </div>
      </nav>
    </aside >
  )
};

export function SideBarItem({ icon, text, link, active, alert }: ItemProps): React.ReactNode {
  const { expanded } = useContext(SideBarContext);
  const navigate = useNavigate();
  const handleNav = (link: string) => {
    navigate(link)
  };

  return (
    <button onClick={() => handleNav(link)} className={`relative flex items-center my-1 px-3 py-2 font-medium rounded-md cursor-pointer transition-colors group
      ${active
        ? "bg-gradient-to-t from-tourney-navy2 to-tourney-navy3 text-tourney-orange"
        : "hover:bg-tourney-navy3 text-white"
      }
    `}>
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 text-left ml-3" : "w-0"}`}>{text}</span>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-white ${expanded ? "" : "top-2"}`} />
      )}

      {!expanded && <div className='absolute left-full rounded-md px-5 py-1 bg-tourney-navy3 text-tourney-orange text-sm invisible opacity-20
        translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-5'>{text}</div>}
    </button>
  )
};
