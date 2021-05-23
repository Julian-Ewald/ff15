import React from 'react';
import { useHistory } from 'react-router-dom';
import '../../App.global.css';

export default function SidebarItem({pathTo, icon} : {
    pathTo: string,
    icon: any
}) {

    const history = useHistory();

    return (
        <>
            <button onClick={() => history.push(`${pathTo}`)} className="sidebarItem">
                {icon}
            </button>
        </>
  );
}