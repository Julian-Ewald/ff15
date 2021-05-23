import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import '../App.global.css';

export default function ChampionScreen () {

    const history = useHistory();
    const location = useLocation<any>();

    const url = `http://ddragon.leagueoflegends.com/cdn/11.10.1/data/en_US/champion/${location.state.name}.json`
    const [champ, setChamp] = useState<any>();
    const [spells, setSpells] = useState<any>([]);
    const [passive, setPassive] = useState<any>();
    const [tags, setTags] = useState<any>([]);

    console.log(require('electron').webFrame.getZoomFactor())

    const getChamp = async () => {
      await fetch(url)
        .then(response => response.json()) 
        .then(data => {
          setChamp(data.data[location.state.name])
          setSpells(data.data[location.state.name].spells)
          setPassive(data.data[location.state.name].passive.image.full)
          setTags(data.data[location.state.name].tags)
        });
    }

    useEffect(() => {
      getChamp()
    }, [])

    return (
      <div className="bigContainer" style={{backgroundColor: '#1D1D1D'}}>
        <div style={{
          padding: 10, 
          display: 'flex',
          flexDirection: 'row',
        }}>
          <div style={{marginRight: 30}}>
            <div className="championText" style={{color: '#C4C4C4', letterSpacing: 0.5, fontSize: 18, whiteSpace: 'nowrap'}}>{location.state.name}</div>
            <div className="championText" style={{color: '#4F4F4F', letterSpacing: 0.5, fontSize: 14, whiteSpace: 'nowrap', marginTop: 5}}>{location.state.title}</div>
            <img style={{height: 320, width: "auto", borderRadius: 10, marginTop: 15}} src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${location.state.name}_0.jpg`} />
            <div style={{display: 'flex', flexDirection: 'row', width: 176, flexWrap: 'wrap', paddingTop: 10}}>
              {
                tags.map((x: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined) => 
                  <div className="championTags">
                    {x}
                  </div>
                )
              }
            </div>
          </div>
          <div style={{marginTop: 57}}>
            <div style={{flexDirection: 'row', display: 'flex'}}>
              <div style={{
                backgroundColor: '#282828',
                padding: 10,
                borderRadius: 10,
                marginRight: 15
              }}>
                <div 
                  className="championText" 
                  style={{
                    color: '#C4C4C4', 
                    letterSpacing: 0.5, 
                    fontSize: 16, 
                    whiteSpace: 'nowrap',
                    marginBottom: 15
                  }}
                >
                  Abilities
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <div style={{marginRight: 30, alignItems: 'center'}}>
                    <img className="spellImg" style={{width: 40, height: "auto", borderRadius: 50}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/passive/${passive}`} />
                    <div
                      className="championText"
                      style={{
                        color: '#6E6E6E', 
                        letterSpacing: 0.5, 
                        fontSize: 14, 
                        whiteSpace: 'nowrap',
                        marginTop: 5,
                        textAlign: 'center'
                      }}
                    >
                      P
                    </div>
                  </div>
                  {
                    spells.map((x: any) => 
                      <div className="spellItem" style={{marginRight: 15, alignItems: 'center'}}>
                        <img className="spellImg" style={{width: 40, height: "auto", borderRadius: 50}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/spell/${x.id}.png`} />
                        <div
                          className="championText" 
                          style={{
                            color: '#6E6E6E', 
                            letterSpacing: 0.5, 
                            fontSize: 14, 
                            whiteSpace: 'nowrap',
                            marginTop: 5,
                            textAlign: 'center'
                          }}
                        >
                          {
                            spells[0].id == x.id ? 'Q' :
                            spells[1].id == x.id ? 'W' :
                            spells[2].id == x.id ? 'E' :
                            'R'
                          }
                        </div>
                      </div>  
                    )
                  }
                </div>
              </div>
              <div style={{
                backgroundColor: '#282828',
                padding: 10,
                borderRadius: 10,
                marginRight: 15,
                width: 555, 
                height: "auto",
              }}>

              </div>
            </div>
            <div style={{
              backgroundColor: '#282828',
              padding: 10,
              borderRadius: 10,
              marginRight: 15,
              width: "auto",
              marginTop: 15
            }}>

            </div>
          </div>
        </div>
      </div>
    );
  };