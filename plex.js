const util = require("util");
const { exec } = require('child_process');
const execute = util.promisify(exec);

const SERVICE_NAME = "plexmediaserver.service";

const ARGS = {
    "status": ["status", SERVICE_NAME],
    "enable": ["start", SERVICE_NAME],
    "disable": ["stop", SERVICE_NAME]
}

const ACTIONS = {
    "status": ARGS["status"].join(' '),
    "enable": ARGS["enable"].join(' '),
    "disable": ARGS["disable"].join(' ')
}

function PlexService() {
    return {
        enable,
        disable,
        status
    }

    function enable () {
        return doExecute('enable');
    }

    function disable () {
        return doExecute('disable');
    }

    function status () {
        return doExecute('status');
    }

    function doExecute(action = "status") {
        return execute("systemctl " + ACTIONS[action])
                .then(output)
                .catch(handleError);
    }

    function output(stdout, stderr) {
        return stderr || stdout;
    }

    function handleError(error) {
        return error; 
    }
}

module.exports = PlexService;