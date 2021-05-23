import React from 'react';
import { useHistory } from 'react-router-dom';
import '../../App.global.css';
import SidebarItem from './SidebarItem';
import { IoSearch, IoAppsOutline } from "react-icons/io5"

export default function Sidebar() {

    const history = useHistory();

    return (
        <div className="sidebar">
            <SidebarItem pathTo="/summonerSearch" icon={<IoSearch style={{color: '#C4C4C4', height: 25, width: 25}} />} />
            <div style={{height: 25}} />
            <SidebarItem pathTo="/champions" icon={<IoAppsOutline style={{color: '#C4C4C4', height: 25, width: 25}} />} />
            <p style={{
                color: 'rgb(141, 141, 141)',
                letterSpacing: 0.5, 
                fontSize: 14,
                whiteSpace: 'nowrap',
                position: 'absolute',
                bottom: 5,
                left: 5,
            }}>
                v0.1
            </p>
        </div>
  );
}
