import * as MRE from 'mixed-reality-extension-sdk-community';

//npm i node-fetch@2
//npm i --save-dev @types/node-fetch@2.x
import fetch from 'node-fetch';

export default class App {

    constructor(private context: MRE.Context) {

        this.context.onStarted(() => this.started());

    }

    private async started() {

        let data;

        data = await fetch("https://gist.githubusercontent.com/norybiak/29c9b6aeeae72fcdea75fe111b1c28e3/raw/b23fc11a25a41d4df724fb3520a3d3b53d2ae010/data.json");
        const json = await data.json();
        console.log(json);

        console.log(" ---- ");

        data = await fetch("https://gist.githubusercontent.com/norybiak/09bd2797d3fdd516961cc03de0071d1e/raw/b73f9f1c70dec3a9fd2db20e54b0038f29471174/hello.txt");
        const text = await data.text();
        console.log(text);

    }

}