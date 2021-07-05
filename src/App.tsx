import React, { FormEvent, Fragment, useState, useEffect } from 'react';
import Search from './components/Search';
import Plantel from './components/Plantel';
import Cancha from './components/Cancha';
import Banco from './components/Banco';
import Spinner from './components/Spinner'
import { Player } from './api/futbol-api'
import html2canvas from 'html2canvas';

function App(): JSX.Element {

  const [plantel, setPlantel] = useState<Player[]> ([])
  const [titulares, setTitulares] = useState<Player[]> ([])
  const [suplentes, setSuplentes] = useState<Player[]> ([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [coordinates, setCoordinates] = useState({x:0,y:0})
  const [canchaURI, setCanchaURI] = useState<string>('')

	useEffect (() => {
		let element: HTMLElement | null = document.querySelector('#cancha');

		if (element !== null && element !== undefined) {
			html2canvas(element).then((canvas: any) => {
				let dataURI = canvas.toDataURL();
				setCanchaURI(dataURI)
			});
		}
	}, [titulares])

	const handleDrag = (e: React.DragEvent<HTMLDivElement>):void => {
		const id = (e.target as HTMLDivElement).id;
		e.dataTransfer.setData('text/plain', id);
	}

	const handleDrop = (e: React.DragEvent):boolean|void => {
		const id: number = +e.dataTransfer.getData('text').trim()
		const dropzone = e.currentTarget.id;
		let newTitulares: Player[] = []
		let newPlayer: boolean = false

		if(dropzone)
		{
			//AQUI DEBO QUITAR EL ELEMENTO DEL ARRAY DE PLANTEL Y COLOCARLO EN EL ARRAY DEPENDIENDO LA DROPZONE (CANCHA O SUPLEMENTES)
			if(dropzone === "cancha")
			{

				let newTitular = titulares.filter((player: Player) => player.player_id === id)

				if(!newTitular.length)
					if(titulares.length > 10){
						setError('Los titulares no pueden ser mas de 11 jugadores')
						return false
					}
					else
						setError('')
				else
					setError('')

				const newPlantel = plantel.filter((player: Player) => player.player_id !== id)
				setPlantel(newPlantel)
				const newSuplentes = suplentes.filter((player: Player) => player.player_id !== id)
				setSuplentes(newSuplentes)

				newTitular = plantel.filter((player: Player) => player.player_id === id)
				if(!newTitular.length) newTitular = suplentes.filter((player: Player) => player.player_id === id)

				//NO ESTA Y ESTOY MOVIENDO UN PLAYER QUE YA ESTA EN CANCHA
				if(!newTitular.length) {
					newTitular = titulares.filter((player: Player) => player.player_id === id)
					newTitulares = titulares.filter((player: Player) => player.player_id !== id)
					newPlayer=true
				}

				newTitular[0].x = coordinates.x;
				newTitular[0].y = coordinates.y;

				if(newPlayer)
					setTitulares([...newTitular, ...newTitulares])
				else
					setTitulares(prevState => [...prevState, ...newTitular])
			}
			else if(dropzone === "banco"){

				setError('')

				const newPlantel = plantel.filter((player: Player) => player.player_id !== id)
				setPlantel(newPlantel)
				const newTitulares = titulares.filter((player: Player) => player.player_id !== id)
				setTitulares(newTitulares)

				let newSuplente = plantel.filter((player: Player) => player.player_id === id)
				if(!newSuplente.length) newSuplente = titulares.filter((player: Player) => player.player_id === id)
				setSuplentes(prevState => [...prevState, ...newSuplente])
			}
			else if(dropzone === "plantel"){

				setError('')

				const newTitulares = titulares.filter((player: Player) => player.player_id !== id)
				setTitulares(newTitulares)
				const newSuplentes = suplentes.filter((player: Player) => player.player_id !== id)
				setSuplentes(newSuplentes)

				let newPlantel = titulares.filter((player: Player) => player.player_id === id)
				if(!newPlantel.length) newPlantel = suplentes.filter((player: Player) => player.player_id === id)
				setPlantel(prevState => [...prevState, ...newPlantel])
			}
		}
	}

	const handleDragEnter = (e: FormEvent):void => {
		e.preventDefault();
	}

	const handleDragLeave = (e: FormEvent):void => {
		e.preventDefault();
	}

	const handleDragOver = (e: React.MouseEvent):void => {
		e.preventDefault()
		setCoordinates({x: e.clientX -25, y: e.clientY-15})
	}

	const handleDragEnd = (e: React.MouseEvent):void => {
		e.preventDefault()
	}

	const handleCleanCancha = (e: React.MouseEvent):void => {
		setError('')
		e.preventDefault()

		setTitulares([])
		setPlantel(prevState => [...prevState, ...titulares])
	}

	const handleCleanBanco = (e: React.MouseEvent):void => {
		setError('')
		e.preventDefault()

		setSuplentes([])
		setPlantel(prevState => [...prevState, ...suplentes])
	}

	const downloadImage = ():void => {
		const img = new Image();
		img.crossOrigin = 'anonymous';  // This tells the browser to request cross-origin access when trying to download the image data.
		// ref: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#Implementing_the_save_feature
		img.src = canchaURI;
		img.onload = () => {
			// create Canvas
			const canvas: any = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			// create a tag
			const a = document.createElement('a');
			a.download = 'formacion.png';
			a.href = canvas.toDataURL('image/png');
			a.click();
		};
	}

  return (
    <div className="container" style={{"marginTop":"20px"}}>

      <Search setPlantel={setPlantel} setLoading={setLoading} loading={loading} />

	  {
		  loading ? <Spinner/> :
		  plantel.length?
			<Fragment>
				<Plantel handleDrop={handleDrop} handleDragOver={handleDragOver} handleDragEnter={handleDragEnter} handleDragLeave={handleDragLeave} plantel={plantel} handleDragEnd={handleDragEnd} handleDrag={handleDrag}  />

					<div className="row" style={{fontWeight:"bold",textAlign:"left","marginTop":"5px"}} >
						<p className="text-danger">{error}</p>
					</div>

					<div className="row">
						<div className="col-12 wrapper">
							<Cancha handleDrop={handleDrop} handleDragOver={handleDragOver} handleDragEnter={handleDragEnter} handleDragLeave={handleDragLeave} titulares={titulares} handleDragEnd={handleDragEnd} handleDrag={handleDrag} />

							<div className="row">
								<div className="col-12">
									<button onClick={handleCleanCancha} className="btn btn-success pull-left">Limpiar cancha</button>
									<button onClick={handleCleanBanco} className="btn btn-danger pull-left">Limpiar banco</button>
								</div>
							</div>

							{
								titulares.length === 11 &&
								<div className="row">
									<div className="col-12" style={{"marginTop":"10px","textAlign":"right"}}>
										<button onClick={downloadImage} className="btn btn-warning pull-right">Exportar como imagen</button>
									</div>
								</div>
							}

							<Banco handleDrop={handleDrop} handleDragOver={handleDragOver} handleDragEnter={handleDragEnter} handleDragLeave={handleDragLeave}  suplentes={suplentes} handleDragEnd={handleDragEnd} handleDrag={handleDrag} />

						</div>
					</div>

			</Fragment>:''
	  }

    </div>
  );
}

export default App;
