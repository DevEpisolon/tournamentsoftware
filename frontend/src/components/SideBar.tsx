import React, { createContext, useContext, useState } from 'react'
import { MdMoreVert, MdOutlineDehaze, MdClose } from 'react-icons/md'; // Material Design

interface SideBarProps {
  children?: React.ReactNode;
};

interface ItemProps {
  icon: React.ReactNode;
  text: string;
  link?: string;
  onClick: (event: React.MouseEventHandler<HTMLButtonElement>) => void;
  active?: boolean;
  alert?: boolean;
};

const SideBarContext = createContext<any>({})

export default function SideBar({ children }: SideBarProps): React.ReactNode {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen sticky self-start top-0 transition-width z-20">
      <nav className="h-full flex flex-col bg-tourney-navy2 border-r shadow-md border-tourney-navy1">
        <div className="sm:p-0 sm:pb-1 md:p-5 md:pb-2 flex justify-between items-center">
          <span className={`overflow-hidden transition-all ${expanded ? "sm:w-16 md:w-32" : "w-0"}`}>
            TAS-32
          </span>
          <button onClick={() => setExpanded((curr) => !curr)} className='bg-tourney-navy2 sm:w-3/4 md:w-full sm:p-0.5 md:p-1.5 rounded-lg hover:bg-tourney-orange'>
            {expanded ? <MdClose size={20} /> : <MdOutlineDehaze size={20} />}
          </button>
        </div>
        <SideBarContext.Provider value={{ expanded }}>
          <ul className='flex-1 md:px-3 sm:px-1 sm:w-11/12 md:w-full'>
            {children}
          </ul>
        </SideBarContext.Provider>
        <div className='flex border-t p-3 border-tourney-navy1'>
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
            <button className='hover:bg-tourney-navy3 rounded-md'>
              <MdMoreVert size={20} />
            </button>
          </div>
        </div>
      </nav>
    </aside >
  )
};

export function SideBarItem({ icon, text, link, onClick, active, alert }: ItemProps): React.ReactNode {
  const { expanded } = useContext(SideBarContext);
  return (
    <a href={link} className={`relative flex items-center my-1 px-3 py-2 font-medium rounded-md cursor-pointer transition-colors group
      ${active
        ? "bg-tourney-navy1 text-tourney-orange"
        : "hover:bg-tourney-navy3 text-white"
      }
    `}
      // any is for my TabKey function
      onClick={(e: any) => onClick(e)}>
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 text-left ml-3" : "w-0"}`}>{text}</span>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-white ${expanded ? "" : "top-2"}`} />
      )}

      {!expanded && <div className='absolute left-full rounded-md px-5 py-1 bg-tourney-navy3 text-white text-sm invisible opacity-20
        translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-5'>{text}</div>}
    </a>
  )
};
