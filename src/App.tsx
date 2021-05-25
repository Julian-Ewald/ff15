import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';

import ChampionsScreen from './screens/ChampionsScreen';
import ChampionScreen from './screens/ChampionScreen';
import SummonerSearchScreen from './screens/SummonerSearchScreen';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';

export default function App() {
  return (
    <Router>
      <TopBar />
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Sidebar />
        <Switch>
          <Route exact path="/champions" component={ChampionsScreen} />
          <Route exact path="/championDetails" component={ChampionScreen} />
          <Route exact path="/summonerSearch" component={SummonerSearchScreen} />
        </Switch>
      </div>
    </Router>
  );
}
