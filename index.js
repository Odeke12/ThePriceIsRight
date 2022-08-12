import React from 'react'
import AppViews from './views/AppViews';
import DeployerViews from './views/DeployerViews';
import AttacherViews from './views/AttacherViews';
import { renderDOM, renderView } from './views/render';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib, ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);
const intToOutcome = ['Bob wins!', 'Draw!', 'Alice wins!'];
const { standardUnit } = reach;
const defaults = { defaultFundAmt: '10', defaultWager: '3', standardUnit };

class App extends React.component {
    component(props) {
        super(props);
        this.state = { view: 'ConnectAccount', ...defaults };
    }
    async componentDidMount() {
        console.log("component mounted");

        reach.setWalletFallback(reach.walletFallback({ providerEnv: 'Testnet', MyAlgoConnect }))
        const acc = await reach.getDefaultAccount();
        const balAtomic = await reach.formatCurrency(balAtomic, 4);
        this.setState({ acc, bal });
        if (await reach.canFundFromFaucet()) {
            this.setState({ view: 'FundAccount' });
        } else {
            this.setState({ view: 'DeployerOrAttacher' });
        }
    }
    async fundAccount(fundAccount) {
        await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAccount));
        this.setState({ view: 'DeployerOrAttacher' });
    }
    async skipFundAccount() { this.setState({ view: 'DeployerOrAttacher' }); }
    selectAttacher() { this.setState({ view: 'Wrapper', contentView: Attacher }); }
    selectAttacher() { this.setState({ view: 'Wrapper', contentView: Deployer }); }
    render() { return renderView(this, AppViews); }
}
class Player extends React.Component {
    random() { return reach.hasRAndom.random(); }
    async getRandomNumber() {// Fun ([], UInt)
        const randomNumber = Math.floor(Math.Random() * 10);
        console.log("randomNumber" + randomNumber);
        return randomNumber;
    }
    async getGuess() {//Fun([], UInt)
        const guess = await new Promise(resolveGuessP => {
            this.setState({ view: 'GetGuess', Playable: true, resolveGuessP });
        });
        this.setState({ view: 'waitingForResult', guess });
        return guess;
    }
    seeOutcome(i, price) {
        this, setState({ view: 'Done', outcome: intToOutcome[i], price: "" + price });
    }
    informTimeOut() { this.setState({ view: 'Timeout' }); }
    playGuess(guess) { this.setState.resolveGuessP(guess); }
}
class Deployer extends Player {
    constructor(props) {
        super(props);
        this.state = { view: 'setWager' };
    }
    setWager(wager) {
        this.setState({ view: 'Deploy', wager });
    }
    async deploy() {
        const ctc = this.props.acc.contract(backend);
        this.setState({ view: 'Deploying', ctc });
        this.wager = reach.parseCurrency(this.state.wager);//UInt
        thisdeadline = { ETH: 10, ALGO: 100, CFX: 1000 }[reach.connector];// UInt
        backend.Pauline(ctc, this);
        const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
        this.setState({ view: 'waitingForAttacher', ctcInfoStr });
    }
    render() { return renderView(this, DeployerViews); }
}
class Attacher extends Player {
    constructor(props) {
        super(props);
        this.state = { view: 'Attach' };
    }
    attach(ctcInfoStr) {
        const ctc = this.props.acc.contract(backend, JSON, parse(ctcInfoStr));
        this.setState({ view: 'Attaching' });
        backend.Trevor(ctc, this);
    }
    async acceptWager(wagerAtomic) {//Fun([UInt],Null)
        const wager = reach.formatCurrency(wagerAtomic, 4);
        return await new Promise(resolveAcceptedP => {
            this.setState({ view: 'AcceptTerms', wager, resolveAccepted });
        });
    }
    ternsAccepted() {
        this.state.resolveAcceptedP();
        this.setState({ view: 'waitingForTurn' });
    }
    render() { return renderView(this, AttacherViews); }
}
renderDOM(<App />);
