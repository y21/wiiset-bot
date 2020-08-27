import CTGP from 'ctgp-rest';
import Rex from './rex';
import Wiimmfi from './wiimmfi';
import TTC from './ttc';
import fetch from 'node-fetch';

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

    public caption(url: string) {
        return fetch('https://captionbot.azurewebsites.net/api/messages?language=en-US', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Type: 'CaptionRequest',
                Content: url
            })
        }).then(x => x.text());
    }

    public cat(): Promise<string> {
        return fetch('http://aws.random.cat/meow')
            .then(x => x.json())
            .then(x => x.file);
    }

    public dog(): Promise<string> {
        return fetch('https://dog.ceo/api/breeds/image/random')
            .then(x => x.json())
            .then(x => x.message);
    }
}