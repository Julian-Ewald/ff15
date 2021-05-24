import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader'
import '../App.global.css';

export default function ChampionsScreen () {

  const history = useHistory();

  const [isLoading, setIsLoading] = useState<boolean>(true) 
  const [champs, setChamps] = useState<any>()
  const [version, setVersion] = useState<string>()

  const getVersion = async () => {
    await fetch("https://ddragon.leagueoflegends.com/api/versions.json")
      .then(response => response.json()) 
      .then(data => {
        setVersion(data[0])
      });
  }
  const getChamps = async () => {
    await fetch(`http://ddragon.leagueoflegends.com/cdn/${version ? version : "11.10.1"}/data/en_US/champion.json`)
      .then(response => response.json()) 
      .then(data => setChamps(data.data));
  }

  useEffect(() => {
    getVersion()
    getChamps()
    setIsLoading(false)
  }, [])

  const list = []

  for(let key in champs) {
    if(champs.hasOwnProperty(key)){ 
      list.push(`${key}`)
    }
  }

  // const MyLoader = (props: JSX.IntrinsicAttributes & IContentLoaderProps & { children?: React.ReactNode; }) => (
  //   <ContentLoader
  //     speed={2}
  //     width={140}
  //     height={138}
  //     viewBox="0 0 140 153"
  //     backgroundColor="#222831"
  //     foregroundColor="#171c22"
  //     className="champion"
  //     {...props}
  //   >
  //     <rect x="20" y="0" rx="2" ry="2" width="100" height="100" /> 
  //     <rect x="30" y="120" rx="2" ry="2" width="80" height="16" /> 
  //   </ContentLoader>
  // )

  return (
    <div className="bigContainer" style={{backgroundColor: '#1D1D1D'}}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {
          list.map(x => 
            <div key={champs[x].id} style={{display: 'flex', flexDirection: 'column'}}>
                <button 
                  onClick={() => history.push({pathname: '/championDetails', state: {name: champs[x].id, title: champs[x].title}})}
                  className="champion"
                >
                  <img
                    className="championIcon"
                    style={{
                      height: 90, 
                      width: 90,
                      borderRadius: 10
                    }} 
                    src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/champion/${champs[x].image.full}`} 
                  />
                  <p className="championText" style={{color: 'whitesmoke', letterSpacing: 0.5, fontSize: 14, whiteSpace: 'nowrap'}}>
                    {champs[x].id}
                  </p>
                </button>
              </div>
          )
        }
      </div>
    </div>
  );
};