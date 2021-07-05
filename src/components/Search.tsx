import React, { Fragment, useState } from 'react'
import { getPlayers, Player } from '../api/futbol-api'

interface props {
    setPlantel: (players: Player[]) => void; 
    setLoading: (loading: boolean) => void;
    loading: boolean
}

export default function Search({setPlantel, setLoading, loading}: props) {

    const [team, setTeam] = useState<string>('')

    const handleSearch = async () => {
        setLoading(true)
        let teamSearch: string = team.replace(" ","_").toLowerCase();
        const players:[] = await getPlayers(teamSearch)
        setPlantel(players)
        setLoading(false)
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-8">
                    <input type="text" className="form-control" value={team} name="team" id="team" onChange={(e) => setTeam(e.target.value)} />
                </div>
                <div className="col-4">
                    {
                        <input type="button" disabled={loading || team.length < 3 ? true: false} value="Buscar" className="btn-primary form-control" onClick={handleSearch} />
                    }
                </div>
            </div>

        <br></br>
        </Fragment>
    )
}
