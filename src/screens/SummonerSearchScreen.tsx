import React, { useState, useRef } from 'react';
import { Formik } from 'formik';
import { IoSearch } from "react-icons/io5"
import '../App.global.css';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

export default function SummonerSearchScreen () {

    const scrollToBtm = useRef<any>(null)
    const [tempSumName, setTempSumName] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [status, setStatus] = useState<any>(-99);
    const [summoner, setSummoner] = useState<any>();

    const [matches, setMatches] = useState<any>([]);
    const [playerPos, setPlayerPos] = useState<any>([]);

    const [summoners, setSummoners] = useState<any>([]);
    const [runes, setRunes] = useState<any>([]);

    const listSums:any = []

    for(let key in summoners) {
        if(summoners.hasOwnProperty(key)){ 
            listSums.push(`${key}`)
        }
    }

    const Loader = (props: JSX.IntrinsicAttributes & IContentLoaderProps & { children?: React.ReactNode; }) => (
        <ContentLoader
          speed={2}
          width="100%"
          height={600}
          viewBox="0 0 100% 600"
          backgroundColor="#171717"
          foregroundColor="#1f1f1f"
          {...props}
        >
          <rect x="0" y="0" rx="52" ry="52" width="102" height="102" /> 
          <rect x="19.5" y="90" rx="10" ry="10" width="60" height="28" />
          <rect x="0" y="140" rx="10" ry="10" width="102" height="21" />
          <rect x="132" y="0" rx="10" ry="10" width="102" height="21" />
          <rect x="132" y="35" rx="10" ry="10" width="965" height="70" />
          <rect x="132" y="115" rx="10" ry="10" width="965" height="70" />
          <rect x="132" y="200" rx="10" ry="10" width="965" height="70" />
          <rect x="132" y="280" rx="10" ry="10" width="965" height="70" />
          <rect x="132" y="365" rx="10" ry="10" width="965" height="70" />
          <rect x="132" y="450" rx="10" ry="10" width="965" height="70" />
          <rect x="132" y="530" rx="10" ry="10" width="965" height="70" />
        </ContentLoader>
    )
    
    return (
    <div className="bigContainer" style={{backgroundColor: '#1D1D1D' }}>
        <Formik
            initialValues={{ summonerName: '' }}
            onSubmit={async (values, { setSubmitting }) => {
                if (values.summonerName != tempSumName && values.summonerName) {
                    setMatches([])
                    setIsLoading(true)
                    scrollToBtm.current?.scrollIntoView({behavior: 'smooth'})
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
    
                    await fetch("http://ddragon.leagueoflegends.com/cdn/11.10.1/data/en_US/summoner.json")
                    .then(response => response.json())
                    .then(data => setSummoners(data.data))
    
                    await fetch("http://ddragon.leagueoflegends.com/cdn/11.10.1/data/en_US/runesReforged.json")
                    .then(response => response.json())
                    .then(data => setRunes(data))
    
                    setIsLoading(false)
                    setTempSumName(values.summonerName);
                    setSubmitting(false)
                }
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
        {isLoading ? (
            <div style={{width: "100%", height: "100%"}}>
                <div style={{padding: 10}}>
                    <Loader />
                </div>
            </div>
        ) : (
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
                                borderRadius: 10,
                                marginLeft: 20,
                                paddingLeft: 10,
                                paddingRight: 10
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
                                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: "100%"}}>
                                                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                            <div style={{fontSize: 12, marginRight: 15}}>
                                                                <div style={{
                                                                    color: x.info.participants[playerPos[i]].win ? '#4BB543' : '#B94646',
                                                                    marginBottom: 5
                                                                }}>
                                                                    {
                                                                        x.info.participants[playerPos[i]].win ? 'Won' : 'Lost'
                                                                    }
                                                                </div>
                                                                <div style={{
                                                                    marginBottom: 5
                                                                }}>
                                                                    {(x.info.participants[playerPos[i]].timePlayed / 60).toFixed(0)}:{Math.round(parseFloat("0." + (x.info.participants[playerPos[i]].timePlayed / 60).toFixed(2).split(".")[1]) * 60)}
                                                                </div>
                                                                <div style={{fontSize: 11}}>
                                                                    {
                                                                        new Date(x.info.gameStartTimestamp).toLocaleDateString()
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div style={{height: 40}}>
                                                                <img style={{width: 40, height: 40, borderRadius: 20, marginRight: 5}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/champion/${x.info.participants[playerPos[i]].championName}.png`} />
                                                                <div className="champLvl" style={{
                                                                    backgroundColor: '#171717',
                                                                    width: 25,
                                                                    padding: 5,
                                                                    textAlign: 'center',
                                                                    borderRadius: 10,
                                                                    paddingLeft: 2,
                                                                    paddingRight: 2,
                                                                    fontSize: 11
                                                                }}>
                                                                    {x.info.participants[playerPos[i]].champLevel}
                                                                </div>
                                                            </div>

                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                marginRight: 20,
                                                                marginLeft: 10
                                                            }}>
                                                                {
                                                                    listSums.map((a: any) => 
                                                                        <>
                                                                            {summoners[a].key == x.info.participants[playerPos[i]].summoner1Id && (
                                                                                <img
                                                                                    src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/spell/${summoners[a].image.full}`}
                                                                                    style={{
                                                                                        width: 25
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    listSums.map((a: any) => 
                                                                        <>
                                                                            {summoners[a].key == x.info.participants[playerPos[i]].summoner2Id && (
                                                                                <img
                                                                                    src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/spell/${summoners[a].image.full}`}
                                                                                    style={{
                                                                                        width: 25
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                marginRight: 20,
                                                                marginLeft: 5,
                                                                alignItems: 'center',
                                                            }}>
                                                                {
                                                                    runes.map((j: any, b: number) => 
                                                                        <>
                                                                            {x.info.participants[playerPos[i]].perks.styles[0].style == runes[b].id && (
                                                                                <img 
                                                                                    src={`C:\\Users\\Julian\\Desktop\\Projekte\\lol_app\\src\\assets\\${runes[b].icon}`} 
                                                                                    style={{
                                                                                        width: 20,
                                                                                        backgroundColor: '#282828',
                                                                                        borderRadius: 50,
                                                                                        padding: 5,
                                                                                        marginRight: 10
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    runes.map((j: any, b: number) => 
                                                                        <>
                                                                            {x.info.participants[playerPos[i]].perks.styles[1].style == runes[b].id && (
                                                                                <img 
                                                                                    src={`C:\\Users\\Julian\\Desktop\\Projekte\\lol_app\\src\\assets\\${runes[b].icon}`} 
                                                                                    style={{
                                                                                        width: 15
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                            <div style={{width: 140}}>{x.info.participants[playerPos[i]].championName}</div>
                                                        </div>
                                                        <div style={{textAlign: 'center', alignItems: 'center'}}>
                                                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: 70}}>
                                                                <div style={{ width: 25, textAlign: "center"}}>{x.info.participants[playerPos[i]].kills}</div>
                                                                <div>/</div>
                                                                <div style={{color: "#B94646", width: 25, textAlign: "center"}}>{x.info.participants[playerPos[i]].deaths}</div>
                                                                <div>/</div>
                                                                <div style={{ width: 25, textAlign: "center"}}>{x.info.participants[playerPos[i]].assists}</div>
                                                            </div>
                                                            <div style={{display: 'flex', flexDirection: 'row', textAlign: "center", justifyContent: 'center', marginTop: 5, fontSize: 12}}>
                                                                <div style={{marginRight: 5, color: '#6E6E6E'}}>
                                                                    KDA:
                                                                </div>
                                                                <div style={{
                                                                    color:
                                                                        parseFloat(((x.info.participants[playerPos[i]].kills + x.info.participants[playerPos[i]].assists) / 
                                                                        x.info.participants[playerPos[i]].deaths).toFixed(2)) >= 7.00 ? 
                                                                        parseFloat(((x.info.participants[playerPos[i]].kills + x.info.participants[playerPos[i]].assists) / 
                                                                        x.info.participants[playerPos[i]].deaths).toFixed(2)) == Infinity ? "#00adb5" : "#4BB543" : 
                                                                        parseFloat(((x.info.participants[playerPos[i]].kills + x.info.participants[playerPos[i]].assists) / 
                                                                        x.info.participants[playerPos[i]].deaths).toFixed(2)) <= 7.00 && 
                                                                        parseFloat(((x.info.participants[playerPos[i]].kills + x.info.participants[playerPos[i]].assists) / 
                                                                        x.info.participants[playerPos[i]].deaths).toFixed(2)) >= 3.00 ? '#DC7612' : "#6E6E6E"
                                                                }}>
                                                                    {((x.info.participants[playerPos[i]].kills + x.info.participants[playerPos[i]].assists) / x.info.participants[playerPos[i]].deaths).toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            display:'flex',
                                                            justifyContent: 'space-between',
                                                            width: 280,
                                                            marginLeft: 100
                                                        }}>
                                                            {x.info.participants[playerPos[i]].item0 != 0 ? (
                                                                <img style={{width: 30, borderRadius: 15}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${x.info.participants[playerPos[i]].item0}.png`} />
                                                            ) : (
                                                                <div style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#282828'}} />
                                                            )}
                                                            {x.info.participants[playerPos[i]].item1 != 0 ? (
                                                                <img style={{width: 30, borderRadius: 15}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${x.info.participants[playerPos[i]].item1}.png`} />
                                                            ) : (
                                                                <div style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#282828'}} />
                                                            )}
                                                            {x.info.participants[playerPos[i]].item2 != 0 ? (
                                                                <img style={{width: 30, borderRadius: 15}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${x.info.participants[playerPos[i]].item2}.png`} />
                                                            ) : (
                                                                <div style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#282828'}} />
                                                            )}
                                                            {x.info.participants[playerPos[i]].item3 != 0 ? (
                                                                <img style={{width: 30, borderRadius: 15}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${x.info.participants[playerPos[i]].item3}.png`} />
                                                            ) : (
                                                                <div style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#282828'}} />
                                                            )}
                                                            {x.info.participants[playerPos[i]].item4 != 0 ? (
                                                                <img style={{width: 30, borderRadius: 15}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${x.info.participants[playerPos[i]].item4}.png`} />
                                                            ) : (
                                                                <div style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#282828'}} />
                                                            )}
                                                            {x.info.participants[playerPos[i]].item5 != 0 ? (
                                                                <img style={{width: 30, borderRadius: 15}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${x.info.participants[playerPos[i]].item5}.png`} />
                                                            ) : (
                                                                <div style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#282828'}} />
                                                            )}
                                                            {x.info.participants[playerPos[i]].item6 != 0 ? (
                                                                <img style={{width: 30, borderRadius: 15, marginLeft: 15}} src={`http://ddragon.leagueoflegends.com/cdn/11.10.1/img/item/${x.info.participants[playerPos[i]].item6}.png`} />
                                                            ) : (
                                                                <div style={{width: 30, height: 30, borderRadius: 15, backgroundColor: '#282828'}} />
                                                            )}
                                                        </div>
                                                        <div className="won_lost" style={{
                                                            backgroundColor: x.info.participants[playerPos[i]].win ? '#4BB543' : '#B94646',
                                                            width: 5,
                                                            borderRadius: 10,
                                                            marginLeft: 'auto'
                                                        }}/>
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
        )}
        <div ref={scrollToBtm} style={{height: 0}} />
    </div>
    );
};