import { Player } from '../api/futbol-api'

interface props {
    handleDrop: (e: React.DragEvent)=> void;
    handleDragOver: (e: any)=> void;
    handleDragEnter: (e: any)=> void;
    handleDragLeave: (e: any)=> void;
    suplentes: Player[];
    handleDragEnd: (e: any)=> void;
    handleDrag: (e: any)=> void;
}

export default function Banco({handleDrop, handleDragOver, handleDragEnter, handleDragLeave, suplentes, handleDragEnd, handleDrag}: props) {
    return (
        <div id="banco" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
                <h5><u>Suplentes</u></h5>
                <ul>
                    {
                        suplentes.map(({player_id, player_name}: Player, index: any) => <li id={player_id.toString()} onDragEnd={handleDragEnd} draggable={true} onDragStart={handleDrag} key={index}>{player_name}</li>)
                    }
                </ul>
        </div>
    )
}