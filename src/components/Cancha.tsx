import React from 'react';
import { Player } from '../api/futbol-api'
import '../css/cancha.css';

interface props {
    handleDrop: (e: any)=> void;
    handleDragOver: (e: any)=> void;
    handleDragEnter: (e: any)=> void;
    handleDragLeave: (e: any)=> void;
    titulares: Player[];
    handleDragEnd: (e: any)=> void;
    handleDrag: (e: any)=> void;
}

export default function Cancha({handleDrop, handleDragOver, handleDragEnter, handleDragLeave, titulares, handleDragEnd, handleDrag}: props) {
    return (
        <div id="cancha" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
            <ul id="titulares">
                {
                    titulares.map(({player_id, player_name,x, y}: Player, index: any) => <li style={{position:"absolute", left:`${x}px`, top:`${y}px`}} id={player_id.toString()} onDragEnd={handleDragEnd} draggable={true} onDragStart={handleDrag}  key={index}>{player_name}</li>)
                }
            </ul>
        </div>
    )
}
