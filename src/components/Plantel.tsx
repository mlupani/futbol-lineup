import { Fragment } from 'react'
import { Player } from '../api/futbol-api'

interface props {
    handleDrop: (e: any)=> void;
    handleDragOver: (e: any)=> void;
    handleDragEnter: (e: any)=> void;
    handleDragLeave: (e: any)=> void;
    plantel: Player[];
    handleDragEnd: (e: any)=> void;
    handleDrag: (e: any)=> void;
}

export default function Plantel({handleDrop, handleDragOver, handleDragEnter, handleDragLeave, plantel, handleDragEnd, handleDrag}: props) {
    return (
        <Fragment>
            <div className="row">
                <div id="plantel" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} className="col-12 plantel" >
                    {
                        plantel.map(({player_id, player_name}: Player, index: any  ):JSX.Element =>
                        <li onDrop={handleDrop} id={player_id.toString()} onDragEnd={handleDragEnd} draggable={true} onDragStart={handleDrag} key={index}>{player_name}</li>)
                    }
                </div>
            </div>

			<br></br>
        </Fragment>
    )
}
