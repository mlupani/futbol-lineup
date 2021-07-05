var apiHeader = { "x-rapidapi-key": "e47e6f05b3mshebf3fdf0a5e9d4dp1ed1eajsndb2206ed0b06", "x-rapidapi-host": "api-football-v1.p.rapidapi.com"}
export interface Player {
    player_name: string;
    player_id: number;
    age: number;
    nationality: string;
    position: string;
    x: number;
    y: number;
}

export const getPlayers = async (team: string) => {
    try {

        const fecha = new Date()
        const ano = fecha.getFullYear()

        let response = await fetch(`https://api-football-v1.p.rapidapi.com/v2/teams/search/${team}`, { "method": "GET", "headers": apiHeader})
        let res = await response.json()
        const team_id = res.api.teams[0].team_id

        response = await fetch(`https://api-football-v1.p.rapidapi.com/v2/players/squad/${team_id}/${ano-1}-${ano}`, { "method": "GET", "headers": apiHeader})
        res = await response.json()

        return res.api.players.map(({player_name, player_id, age, nationality, position}:Player):Player => {
            return {player_name: player_name, player_id: player_id, age: age, nationality: nationality, position: position, x: 0, y:0}
        })

    } catch (error) {
        console.log(error)
    }

}