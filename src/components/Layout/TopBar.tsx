import React from 'react';
import '../../App.global.css';
import { IoClose, IoRemove } from "react-icons/io5"
const { ipcRenderer } = require('electron')
const ipc = ipcRenderer

export default function TopBar() {
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div className="topBar">
                
            </div>
            <div onClick={() => ipc.send('minimizeApp')} className="topBarItem">
                <IoRemove style={{color: '#c4c4c4', width: 20, height: 20}} />
            </div>
            <div onClick={() => ipc.send('closeApp')} className="close">
                <IoClose style={{color: '#c4c4c4', width: 20, height: 20}} />
            </div>
        </div>
  );
}
