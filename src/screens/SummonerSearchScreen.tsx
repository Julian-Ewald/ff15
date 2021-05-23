import React, { useEffect, useState, useRef } from 'react';
import { Formik } from 'formik';
import { IoSearch } from "react-icons/io5"
import '../App.global.css';

export default function SummonerSearchScreen () {

    const scrollToBtm = useRef<any>(null)

    const [modalVisible, setModalVisible] = useState(false);
    const [status, setStatus] = useState<any>(-99);
    const [summoner, setSummoner] = useState<any>();

    const [matches, setMatches] = useState<any>([]);
    const [playerPos, setPlayerPos] = useState<any>(0);

    return (
    <div className="bigContainer" style={{backgroundColor: '#1D1D1D' }}>
        <Formik
            initialValues={{ summonerName: '' }}
            onSubmit={async (values, { setSubmitting }) => {
                setMatches([])
                const response = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${values.summonerName}`, {
                    headers: {
                        "X-Riot-Token": "RGAPI-7a684882-6c53-4714-9914-ff9803f332f1"
                    }
                })
                const resSummoner = await response.json()
                const resStatus = await response.status
                setSummoner(resSummoner)
                setStatus(resStatus)

                await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${resSummoner.puuid}/ids?start=0&count=20`, {
                    headers: {
                        "X-Riot-Token": "RGAPI-7a684882-6c53-4714-9914-ff9803f332f1"
                    }
                })
                .then(response => response.json())
                .then(async (data) => {
                    let temp: any = []
                    let temp1: any = []
                    for (let i = 0; i < data.length; i++) {
                        await fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${data[i]}`, {
                            headers: {
                                "X-Riot-Token": "RGAPI-7a684882-6c53-4714-9914-ff9803f332f1"
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status) {
                                return
                            } else {
                                temp.push(data)
                                for (let k = 0; k < data.metadata.participants.length; k++) {
                                    if (data.metadata.participants[k] == resSummoner.puuid) {
                                        temp1.push(k)
                                    }
                                }
                            }
                        })
                    }
                    setMatches(temp)
                    setPlayerPos(temp1)
                    temp = []
                    temp1 = []
                })
                scrollToBtm.current?.scrollIntoView({behavior: 'smooth'})
                setSubmitting(false)
            }}
        >
        {({ handleChange, handleSubmit, }) => (
            <div style={{padding: 10, display: 'flex', flexDirection: 'row', height: 40}}>
                <div onClick={() => setModalVisible(!modalVisible)} className="regionDropdown" style={{ backgroundColor: '#171717', marginRight: 15, paddingRight: 10, paddingLeft: 10, borderRadius: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <div style={{color: '#C4C4C4', letterSpacing: 0.5, fontSize: 14, whiteSpace: 'nowrap'}}>EUW</div>
                </div>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'row', width: "100%"}}>
                    <input type="text" className="bigSearchBar" style={{borderColor: status == 200 || status == -99 ? '#171717' : 'red'}} name="summonerName" onChange={handleChange} placeholder="Search Summoner or Champion..." />
                    <button onClick={() => handleSubmit} type="submit" className="searchIcon" style={{backgroundColor: '#171717', marginLeft: 10, borderRadius: 10, padding: 10}}>
                        <IoSearch style={{color: '#C4C4C4', height: 20, width: 20}} />
                    </button>
                </form>
            </div>
        )}
        </Formik>
        {
            modalVisible && (
                <div style={{height: 50, width: 100, backgroundColor: '#171717', borderRadius: 10, zIndex: 99, marginLeft: 10, position: 'absolute'}}>

                </div>
            )
        }
        <div style={{width: "100%", height: "100%"}}>
            <div style={{padding: 10}}>
                {status == 200 ? (
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div>
                            <img 
                                style={{width: 100, height: "auto", borderRadius: 50, borderStyle: 'solid', borderWidth: 2, borderColor: '#C4C4C4'}} 
                                src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/profileicon/${summoner.profileIconId}.png`} 
                            />
                            <div className="summonerLvl" style={{
                                backgroundColor: '#171717',
                                padding: 5,
                                width: 50,
                                borderRadius: 10,
                                color: '#C4C4C4',
                                borderStyle: 'solid',
                                borderWidth: 2,
                                borderColor: '#C4C4C4',
                                textAlign: 'center'
                            }}>
                                {summoner.summonerLevel}
                            </div>
                            <div className="championText" style={{
                                color: '#C4C4C4', 
                                letterSpacing: 0.5, 
                                fontSize: 18, 
                                whiteSpace: 'nowrap'
                            }}>
                                {summoner.name}
                            </div>
                        </div>
                        <div className="matchH" style={{
                            width: "100%", 
                            backgroundColor: "#404040",
                            borderRadius: 10,
                            marginLeft: 20,
                            padding: 10
                        }}>
                            <div style={{
                                color: '#C4C4C4', 
                                letterSpacing: 0.5, 
                                fontSize: 18, 
                                whiteSpace: 'nowrap',
                                marginBottom: 15,
                            }}>
                                Match History
                            </div>
                            <div>
                                {
                                    matches.map((x:any, i:number) => 
                                        <div className="matchHItem" key={x.info.gameId}>
                                            {
                                                <div>
                                                    <div>{x.info.participants[playerPos[i]].championName}</div>
                                                </div>
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ) : status == -99 ? (
                    <div style={{color: 'whitesmoke'}}>
                        Search for a User :)
                    </div>
                ) : (
                    <div style={{color: 'whitesmoke'}}>
                        Invalid Username :(
                    </div>
                )}
            </div>
        </div>
        <div ref={scrollToBtm} style={{height: 0}} />
    </div>
    );
};