import CTGP from 'ctgp-rest';
import Rex from './rex';
import Wiimmfi from './wiimmfi';
import TTC from './ttc';

export class RestClient {
    public ctgp: typeof CTGP;
    public rex: typeof Rex;
    public wiimmfi: typeof Wiimmfi;
    public ttc: typeof TTC;
    
    constructor() {
        this.ctgp = CTGP;
        this.rex = Rex;
        this.wiimmfi = Wiimmfi;
        this.ttc = TTC;
    }
}